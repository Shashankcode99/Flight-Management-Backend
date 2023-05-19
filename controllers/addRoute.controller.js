const pool = require("../db/connection/connect");
async function insertRoutes(req, res) {
  try {
    const inValidPayload = await payloadValidator(req.body);
    const {
      origin,
      destination,
      departure_airport,
      arrival_airport,
      distance,
      travel_time,
    } = req.body;
    if (inValidPayload.errors.length) {
      return res.status(400).json(inValidPayload);
    } else {
      const query = `INSERT INTO routes (origin, destination, departure_airport, arrival_airport, distance, travel_time) VALUES ($1, $2, $3, $4, $5, $6)`;
      const values = [
        origin,
        destination,
        departure_airport,
        arrival_airport,
        distance,
        travel_time,
      ];
      await pool.query(query, values);
      res.status(201).json("Flights Created Successfully");
    }
  } catch (error) {
    console.error("Error Occurred:", error);
  }
}

async function getRoutes(req, res) {
  try {
    const query = "SELECT * FROM routes";
    const results = await pool.query(query);

    if (results.rows.length === 0) {
      res.status(200).json("No routes found");
    } else {
      res.status(201).json(results.rows);
    }
  } catch (error) {
    console.error("Error Occurred While Fetching Routes");
  }
}

async function payloadValidator(payload) {
  const {
    origin,
    destination,
    departure_airport,
    arrival_airport,
    distance,
    travel_time,
  } = payload;
  const errorMessage = {
    errors: [],
  };

  //Origin Validator
  if (!origin) {
    errorMessage.errors.push({
      field: "origin",
      error: "Origin Missing",
    });
  } else if (typeof origin !== "string") {
    errorMessage.errors.push({
      field: "origin",
      error: "Origin should be a valid string",
    });
  }

  // Destination Validator
  if (!destination) {
    errorMessage.errors.push({
      field: "destination",
      error: "Destination Missing",
    });
  } else if (typeof destination !== "string") {
    errorMessage.errors.push({
      field: "destination",
      error: "Destination should be a valid string",
    });
  }

  // Destination Airport Validator
  if (typeof departure_airport !== "string") {
    errorMessage.errors.push({
      field: "departure_airport",
      error: "Departure Airport should be a valid string",
    });
  }

  // Arrival Airport Validator
  if (typeof arrival_airport !== "string") {
    errorMessage.errors.push({
      field: "arrival_airport",
      error: "arrival_airport should be a valid string",
    });
  }

  //Distance Validator
  if (!distance) {
    errorMessage.errors.push({
      field: "distance",
      error: "Distance value is required",
    });
  } else if (typeof distance !== "number") {
    errorMessage.errors.push({
      field: "distance",
      error: "Distance should be a valid integer value",
    });
  }

  //Time Validator
  if (!travel_time) {
    errorMessage.errors.push({
      field: "travel_time",
      error: "Travel Time value is required",
    });
  } else if (typeof travel_time !== "string") {
    errorMessage.errors.push({
      field: "travel_time",
      error: "Travel Time should be a valid string",
    });
  }

  return errorMessage;
}

module.exports = { getRoutes,insertRoutes };
