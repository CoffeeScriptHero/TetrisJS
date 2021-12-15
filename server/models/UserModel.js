const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  topScore: {
    type: String,
    default: "000000",
  },
  linesScore: {
    type: String,
    default: "000",
  },
  id: {
    type: Number,
    required: true,
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
