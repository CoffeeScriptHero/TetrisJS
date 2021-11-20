const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
  },
  highScore: {
    type: Number,
    default: 0,
  },
  id: {
    type: Number,
    required: true,
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
