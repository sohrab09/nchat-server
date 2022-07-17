const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  employeeEmail: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  employeePhoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);
