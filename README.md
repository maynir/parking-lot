# Parking Lot API

This is a simple API for managing a parking lot. It provides two endpoints:

## `/entry`

Adds an entry to the parking lot database and returns a ticket ID.

### Request

- Method: POST
- URL: `/entry`
- Query Parameters:
    - `plate` (string, required): The license plate of the vehicle.
    - `parkingLot` (string, required): The ID of the parking lot.

### Response

- Status Code: 200 OK
- Content Type: application/json
- Body:
    - `ticketId` (number): The ticket ID assigned to the entry.

#### Example

```bash
curl -X POST "http://<public_ip>:5000/entry?plate=ABC-123&parkingLot=1"
```

## `/exit`

Removes an entry from the parking lot database and returns the license plate, total parked time, parking lot ID, and charge.

### Request

- Method: POST
- URL: `/exit`
- Query Parameters:
    - `ticketId` (number, required): The ticket ID of the entry to remove.

### Response

- Status Code: 200 OK
- Content Type: application/json
- Body:
    - `plate` (string): The license plate of the vehicle.
    - `parkingLot` (string): The ID of the parking lot.
    - `totalParkedTime` (number): The total time the vehicle was parked, in minutes.
    - `charge` (number): The charge for parking, based on 15-minute increments at a rate of $10 per hour.

#### Example

```bash
curl -X POST "http://<public_ip>:5000/exit?ticketId=1"
```