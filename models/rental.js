const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Rental = mongoose.model(
  "Rental",
  new Schema({
    customer: {
      type: new Schema({
        name: { type: String, reuqired: true, minLength: 5, maxLength: 50 },
        isGold: { type: Boolean, default: false },
        phone: { type: String, required: true, maxLength: 10 },
      }),
      required: true,
    },
    movie: {
      type: new Schema({
        title: {
          type: String,
          required: true,
          minLength: 5,
          maxLength: 255,
          trim: true,
        },
        dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const { customerId, movieId } = rental;
  const rentals = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return rentals.validate({ customerId, movieId });
}

exports.Rental = Rental;
exports.validate = validateRental;
