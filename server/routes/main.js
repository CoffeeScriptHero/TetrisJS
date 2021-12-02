const express = require("express");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const UserModel = require("../models/UserModel");

const router = express.Router();
const path = require("path");

module.exports = router;
