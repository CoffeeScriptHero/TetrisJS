const express = require("express");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const UserModel = require("../models/UserModel");

const router = express.Router();

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
