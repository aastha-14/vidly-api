const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");

exports.Customer = mongoose.model(
  "Customer",
  new Schema({
    name: { type: String, reuqired: true, minLength: 5, maxLength: 50 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: true, maxLength: 10 },
  })
);

function validateCustomer(customer) {
  const { name, phone, isGold } = customer;
  const customers = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().max(10).required(),
    isGold: Joi.boolean(),
  });
  return customers.validate({ name, phone, isGold });
}

exports.validate = validateCustomer;
