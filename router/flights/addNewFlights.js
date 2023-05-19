const express = require("express");
const router = express.Router();
const {isAdmin} = require("../../middlewares/verifyToken");
const pool = require("../../db/connection/connect");
const {getFlights,insertFlight} = require("../../controllers/addFlight.controller");

router.get("/flight", getFlights);
router.post("/flight", isAdmin, insertFlight);
module.exports = router;
