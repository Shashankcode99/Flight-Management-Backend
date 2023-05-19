const pool = require("../db/connection/connect");
const validator = require("validator");
async function insertFlight(req, res) {
  try {
    const inValidPayload = await payloadValidator(req.body);
    const {
      flight_number,
      airline_name,
      route_id,
      departure_time,
      arrival_time,
      total_seats,
      remaining_seats,
    } = req.body;

    if (inValidPayload.errors.length) {
      return res.status(400).json(inValidPayload);
    } else {
      const query = `INSERT INTO flights (flight_number,
        airline_name,
        route_id,
        departure_time,
        arrival_time,
        total_seats,
        remaining_seats) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
      const values = [
        flight_number,
        airline_name,
        route_id,
        departure_time,
        arrival_time,
        total_seats,
        remaining_seats,
      ];
      await pool.query(query, values);
      res.status(201).json("Flights Created Successfully");
    }
  } catch (error) {
    console.error("Error Occurred:", error);
  }
}

async function getFlights(req, res) {
  try {
    const query = "SELECT * FROM flights";
    const results = await pool.query(query);

    if (results.rows.length === 0) {
      res.status(200).json("No flighst found");
    } else {
      res.status(201).json(results.rows);
    }
  } catch (error) {
    console.error("Error Occurred while fetching flights");
  }
}

async function payloadValidator(payload) {
  const {
    flight_number,
    airline_name,
    route_id,
    departure_time,
    arrival_time,
    total_seats,
    remaining_seats,
  } = payload;
  const errorMessage = {
    errors: [],
  };

  //flight_number Validator
  if (!flight_number) {
    errorMessage.errors.push({
      field: "flight_number",
      error: "Flight Number Missing",
    });
  } else if (typeof flight_number !== "number") {
    errorMessage.errors.push({
      field: "flight_number",
      error: "Flight Number should be a valid integer",
    });
  }

  // airline_name Validator
  if (!airline_name) {
    errorMessage.errors.push({
      field: "airline_name",
      error: "Airline Name Missing",
    });
  } else if (typeof airline_name !== "string") {
    errorMessage.errors.push({
      field: "airline_name",
      error: "Airline Name should be a valid string",
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

  // departure_time Validator
  if (!departure_time) {
    errorMessage.errors.push({
      field: "departure_time",
      error: "Departure Time is required",
    });
  } else if (validator.isISO8601(departure_time)) {
    errorMessage.errors.push({
      field: "departure_time",
      error: "Departure Time should be a valid",
    });
  }

  //arrival_time Validator
  if (!arrival_time) {
    errorMessage.errors.push({
      field: "arrival_time",
      error: "Arrival Time is required",
    });
  } else if (validator.isISO8601(arrival_time)) {
    errorMessage.errors.push({
      field: "arrival_time",
      error: "Arrival Time should be a valid",
    });
  }

  //total_seats Validator
  if (!total_seats) {
    errorMessage.errors.push({
      field: "total_seats",
      error: "Total seats value is required",
    });
  } else if (typeof total_seats !== "number") {
    errorMessage.errors.push({
      field: "total_seats",
      error: "Total seats should be a valid integer",
    });
  }

  //remaining_seats Validator
  if (!remaining_seats) {
    errorMessage.errors.push({
      field: "remaining_seats",
      error: "Remaining seats value is required",
    });
  } else if (typeof remaining_seats !== "number") {
    errorMessage.errors.push({
      field: "remaining_seats",
      error: "Remaining seats should be a valid integer",
    });
  }

  return errorMessage;
}

module.exports = {getFlights,insertFlight};