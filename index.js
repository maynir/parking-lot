const express = require('express')
const cors = require('cors');
const fs = require('fs');
const app = express()
const port = 3000

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/entry', (req, res) => {
  const plate = req.query.plate;
  const parkingLot = req.query.parkingLot;

  const ticketIdCounter = JSON.parse(fs.readFileSync('db/ticket_id_counter.json')).id;
  const ticketId = ++ticketIdCounter;

  const timeOfArrival = Date.now();

  const entry = {
    plate: plate,
    parkingLot: parkingLot,
    timeOfArrival: timeOfArrival,
  };

  const database = JSON.parse(fs.readFileSync('db/parking_lot_entries.json'));
  database[ticketId] = entry;
  fs.writeFileSync('db/parking_lot_entries.json', JSON.stringify(database));

  fs.writeFileSync('db/ticket_id_counter.json', JSON.stringify({ id: ticketIdCounter })); // update ticket id

  res.json({ ticketId: ticketId });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
