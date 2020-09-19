const mongoose = require("mongoose");
const { Schema } = mongoose;

module.exports = Genre = mongoose.model(
  "Genre",
  new Schema({
    genre: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
      lowercase: true,
    },
  })
);
