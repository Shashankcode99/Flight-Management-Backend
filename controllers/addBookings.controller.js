const pool = require("../db/connection/connect");
async function insertBookingDetails(req, res) {
  try {
    const inValidPayload = await payloadValidator(req.body);
    const { flight_id, users_id, seat_number, route_id } = req.body;

    if (inValidPayload.errors.length) {
      return res.status(400).json(inValidPayload);
    } else {
      const query = `SELECT remaining_seats FROM flights WHERE id = $1 AND route_id = $2`;
      const values = [flight_id, route_id];
      const result = await pool.query(query, values);
      const availableSeats = result.rows[0].remaining_seats;

      if (availableSeats > 0) {
        try {
          const query = `INSERT INTO bookings (
        flight_id,
        users_id,
        seat_number,
        route_id) VALUES ($1, $2, $3, $4)`;
          const values = [flight_id, users_id, seat_number, route_id];
          await pool.query(query, values);

          const query2 = `UPDATE flights SET remaining_seats = ${availableSeats} - $1 WHERE id = $2 AND route_id = $3 `;
          const decrementValue = [1, flight_id, route_id ];
          await pool.query(query2, decrementValue);
          res.status(201).json("Booking Done Successfully");

          try {
            const query3 = `INSERT INTO seatings (
                flight_id,
                seat_number,
                is_booked
                ) VALUES ($1, $2, $3)`;
            const values3 = [flight_id, seat_number, true];
            await pool.query(query3, values3);
          } catch (error) {
            console.error("Error while booking seats");
          }
        } catch (error) {
          console.error("Error Occurred While Booking");
        }
      } else {
        res.status(400).json({ message: "No More Seats Left" });
      }
    }
  } catch (error) {
    console.error("Error Occurred:", error);
  }
}

async function getBookings(req, res) {
  try {
    const query = "SELECT * FROM bookings";
    const results = await pool.query(query);

    if (results.rows.length === 0) {
      res.status(200).json("No bookings found");
    } else {
      res.status(201).json(results.rows);
    }
  } catch (error) {
    console.error("Error Occurred while fetching bookings");
  }
}

async function payloadValidator(payload) {
  const { flight_id, users_id, seat_number, route_id } = payload;
  const errorMessage = {
    errors: [],
  };

  //flight_id Validator
  if (!flight_id) {
    errorMessage.errors.push({
      field: "flight_id",
      error: "Flight Id Missing",
    });
  } else if (typeof flight_id !== "number") {
    errorMessage.errors.push({
      field: "flight_id",
      error: "Flight Id should be a valid integer",
    });
  }

  // users_id Validator
  if (!users_id) {
    errorMessage.errors.push({
      field: "users_id",
      error: "User Id Missing",
    });
  } else if (typeof users_id !== "number") {
    errorMessage.errors.push({
      field: "users_id",
      error: "Users Id should be a valid integer",
    });
  }

  // route_id Validator
  if (!route_id) {
    errorMessage.errors.push({
      field: "route_id",
      error: "Route Id is Mandatory",
    });
  } else if (typeof route_id !== "number") {
    errorMessage.errors.push({
      field: "route_id",
      error: "Route Id should be a valid integer",
    });
  }

  // seat_number Validator
  if (!seat_number) {
    errorMessage.errors.push({
      field: "seat_number",
      error: "Seat Number is required",
    });
  } else if (typeof seat_number !== "number") {
    errorMessage.errors.push({
      field: "seat_number",
      error: "Seat Number should be a valid integer",
    });
  }
  return errorMessage;
}

module.exports = { getBookings, insertBookingDetails };
