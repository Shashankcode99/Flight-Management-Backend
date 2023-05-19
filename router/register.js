require("dotenv").config();
const express = require("express");
const router = express.Router();
const authController = require ('../controllers/authentication.controller');

router.post("/register", authController.registerUser);
router.post("/login", authController.userLogin);
module.exports = router;
