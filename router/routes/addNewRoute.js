const express = require("express");
const router = express.Router();
const { isAdmin } = require("../../middlewares/verifyToken");
const { getRoutes, insertRoutes } = require("../../controllers/addRoute.controller");

router.get("/route", getRoutes);
router.post("/route", isAdmin, insertRoutes);

module.exports = router;
