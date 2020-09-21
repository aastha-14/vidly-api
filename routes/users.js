const _ = require("lodash");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  // this id is fetched from token payload
  const user = await User.findById(req.user._id).select("-password");
  res.json({ user });
});
//user registration
router.post("/", async (req, res) => {
  try {
    const result = validate(req.body);
    if (result.error)
      return res.status(400).json(result.error.details[0].message);
    const { name, email, password } = result.value;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already registered." });

    user = await new User({ name, email, password });
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    const token = user.generateAuthToken();

    res
      .header("x-auth-token", token)
      .json(_.pick(user, ["_id", "name", "email"]));
  } catch (e) {
    res.status(400).json({ error: `${e.message}` });
  }
});

module.exports = router;
