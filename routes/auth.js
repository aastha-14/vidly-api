const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { User } = require("../models/users");

function validate(user) {
  const { email, password } = user;
  const users = Joi.object({
    email: Joi.string().min(5).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return users.validate({ email, password });
}

//Authenticating user
router.post("/", async (req, res) => {
  const result = validate(req.body);
  if (result.error)
    return res.status(400).json(result.error.details[0].message);
  const { email, password } = result.value;
  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword)
    return res.status(400).json({ msg: "Invalid credentials" });
  const token = user.generateAuthToken();
  res.json({ token });
});

module.exports = router;
