const express = require("express");
const router = express.Router();
const {isAdmin} = require("../../middlewares/verifyToken");
const pool = require("../../db/connection/connect");
const {getBookings,insertBookingDetails} = require("../../controllers/addBookings.controller");
router.get("/bookings", getBookings);
router.post("/booking", insertBookingDetails);
module.exports = router;
