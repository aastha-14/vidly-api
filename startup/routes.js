const error = require("../middleware/error");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", require("../routes/genres"));
  app.use("/api/customer", require("../routes/customer"));
  app.use("/api/movies", require("../routes/movies"));
  app.use("/api/rental", require("../routes/rental"));
  app.use("/api/users", require("../routes/users"));
  app.use("/api/login", require("../routes/auth"));

  // error middleware
  app.use(error);
};
