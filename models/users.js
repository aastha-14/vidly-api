const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  email: {
    type: String,
    unique: true,
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  password: { type: String, required: true, minLength: 5, maxLength: 1024 },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const { name, email, password } = user;
  const users = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return users.validate({ name, email, password });
}

exports.User = User;
exports.validate = validateUser;
