const express = require("express");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const UserModel = require("../models/UserModel");

const router = express.Router();
const path = require("path");

// router.get(
//   "/get-users",
//   asyncMiddleware(async (req, res, next) => {
//     UserModel.find({}, (err, result) => {
//       if (err) throw err;
//       if (result) {
//         res.json(result);
//       } else {
//         res.send(
//           JSON.stringify({
//             error: "Error",
//           })
//         );
//       }
//     });
//   })
// );

module.exports = router;
