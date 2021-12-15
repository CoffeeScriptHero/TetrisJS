const express = require("express");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const UserModel = require("../models/UserModel");
const router = express.Router();

router.post(
  "/submit-score",
  asyncMiddleware(async (req, res, next) => {
    const { nickname, topScore, linesScore, id } = req.body;
    const thisUser = await UserModel.findOne({ nickname }).exec();
    if (!thisUser) {
      await UserModel.create({
        nickname,
        topScore,
        linesScore,
        id,
      });
    }
    if (parseInt(topScore) > parseInt(thisUser.topScore)) {
      await UserModel.updateOne({ id }, { topScore });
    }
    if (parseInt(linesScore) > parseInt(thisUser.linesScore)) {
      await UserModel.updateOne({ id }, { linesScore });
    }
  })
);

router.post(
  "/get-top-score",
  asyncMiddleware(async (req, res, next) => {
    const { id } = req.body;
    const user = await UserModel.find({ id });
    if (user) res.status(200).json({ topScore: user[0].topScore });
  })
);

router.get(
  "/get-users",
  asyncMiddleware(async (req, res, next) => {
    const users = await UserModel.find(
      {},
      "nickname topScore linesScore -_id"
    ).sort({
      topScore: -1,
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
