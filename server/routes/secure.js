const express = require("express");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const UserModel = require("../models/UserModel");
const router = express.Router();

router.post(
  "/submit-score",
  asyncMiddleware(async (req, res, next) => {
    const { nickname, score } = req.body;
    const thisUser = await UserModel.findOne({ nickname }).exec();
    if (score > thisUser.highScore) {
      await UserModel.updateOne({ nickname }, { highScore: score });
    }
    res.status(200).json({ status: "ok" });
  })
);

router.get(
  "/scores",
  asyncMiddleware(async (req, res, next) => {
    const users = await UserModel.find({}, "nickname highScore -_id").sort({
      highScore: -1,
    });
    res.status(200).json(users);
  })
);

module.exports = router;
