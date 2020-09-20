const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

function validateGenres(genre) {
  const genres = Joi.object({ genre: Joi.string().min(5).max(50).required() });
  return genres.validate(genre);
}

const genreSchema = new Schema({
  genre: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
    lowercase: true,
  },
});
const Genre = mongoose.model("Genre", genreSchema);

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenres;
