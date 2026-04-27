const mongoose = require("mongoose");

module.exports = mongoose.model("Attendance", {
  id: Number,
  name: String,
  time: String
});