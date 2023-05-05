const express = require('express')
const cors = require('cors');
const fs = require('fs');
const app = express()
const port = 5000

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/entry', (req, res) => {
  const plate = req.query.plate;
  const parkingLot = req.query.parkingLot;

  let ticketIdCounter = JSON.parse(fs.readFileSync('db/ticket_id_counter.json')).id;
  const ticketId = ++ticketIdCounter;

  const timeOfArrival = Date.now();

  const entry = {
    plate: plate,
    parkingLot: parkingLot,
    timeOfArrival: timeOfArrival,
  };

  const database = JSON.parse(fs.readFileSync('db/parking_lot_entries.json'));

  if (plateExistsInDatabase(plate, database)) return res.status(400).json({ error: 'Plate already exists in the database' });

  database[ticketId] = entry;
  fs.writeFileSync('db/parking_lot_entries.json', JSON.stringify(database));

  fs.writeFileSync('db/ticket_id_counter.json', JSON.stringify({ id: ticketIdCounter })); // update ticket id

  res.json({ ticketId: ticketId });
});

function plateExistsInDatabase(plate, database) {
  for (const [ticketId, entry] of Object.entries(database)) {
    if (entry.plate === plate) return true;
  }
  return false;
}

app.post('/exit', (req, res) => {
  const ticketId = parseInt(req.query.ticketId);

  const database = JSON.parse(fs.readFileSync('db/parking_lot_entries.json'));
  const entry = database[ticketId];

  if (!entry) return res.status(400).json({ error: 'Invalid ticketId' });

  const totalParkedTime = Math.round((Date.now() - entry.timeOfArrival) / (1000 * 60));
  const charge = calculateCharge(totalParkedTime);

  const response = {
    plate: entry.plate,
    parkingLot: entry.parkingLot,
    totalParkedTime: totalParkedTime,
    charge: charge,
  };

  delete database[ticketId];
  fs.writeFileSync('db/parking_lot_entries.json', JSON.stringify(database));

  res.json(response);
});

function calculateCharge(totalParkedTime) {
  const hoursParked = Math.ceil(totalParkedTime / 60);
  const charge = hoursParked * 10;
  return charge;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
