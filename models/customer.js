const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = Customer = mongoose.model(
  "Customer",
  new Schema({
    name: { type: String, reuqired: true, minLength: 5, maxLength: 50 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: true, maxLength: 10 },
  })
);
