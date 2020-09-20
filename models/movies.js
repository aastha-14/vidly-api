const mongoose = require("mongoose");
const { Schema } = mongoose;
const { genreSchema } = require("./genres");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.validate = function validateMovies(movie) {
  const { title, genreId, numberInStock, dailyRentalRate } = movie;
  const movies = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().integer().min(0).required(),
    dailyRentalRate: Joi.number().integer().min(0).required(),
  });
  return movies.validate({ title, genreId, numberInStock, dailyRentalRate });
};

exports.Movie = mongoose.model(
  "Movie",
  new Schema({
    title: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 255,
      trim: true,
    },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, required: true, min: 0, max: 255 },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
  })
);
