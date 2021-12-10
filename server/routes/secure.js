const express = require("express");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const UserModel = require("../models/UserModel");
const router = express.Router();

router.post(
  "/submit-score",
  asyncMiddleware(async (req, res, next) => {
    const { nickname, score, lines, id } = req.body;
    const thisUser = await UserModel.findOne({ nickname }).exec();
    if (!thisUser) {
      await UserModel.create({
        nickname,
        highScore: score,
        linesScore: lines,
        id,
      });
    }
    if (parseInt(score) > parseInt(thisUser.highScore)) {
      await UserModel.updateOne({ id }, { highScore: score });
    }
    if (parseInt(lines) > parseInt(thisUser.linesScore)) {
      await UserModel.updateOne({ id }, { linesScore: lines });
    }
  })
);

router.get(
  "/get-users",
  asyncMiddleware(async (req, res, next) => {
    const users = await UserModel.find({}, "nickname highScore -_id").sort({
      highScore: -1,
    });
    res.status(200).json(users);
  })
);

router.post(
  "/signup",
  asyncMiddleware(async (req, res, next) => {
    const { nickname, id } = req.body;
    const sameNickname = await UserModel.findOne({ nickname }).exec();
    if (sameNickname) {
      res.status(400).json({ status: "bad" });
    } else {
      await UserModel.create({ nickname, id });
      res.status(200).json({ status: "ok" });
    }
  })
);

module.exports = router;
