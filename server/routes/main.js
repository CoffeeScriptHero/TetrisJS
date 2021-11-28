const express = require("express");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const UserModel = require("../models/UserModel");

const router = express.Router();
const path = require("path");

router.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../../", "index.html"));
});

router.get("css/style.css", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../../", "css/style.css"));
});

router.get("/status", (req, res, next) => {
  res.status(200);
  res.json({ status: "ok" });
});

router.post(
  "/signup",
  asyncMiddleware(async (req, res, next) => {
    const { nickname, id } = req.body;
    await UserModel.create({ nickname, id });
    res.status(200).json({ status: "ok" });
  })
);

module.exports = router;
