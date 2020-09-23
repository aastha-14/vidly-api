const express = require("express");
const app = express();
const morgan = require("morgan");
const winston = require("winston");

require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

const PORT = 5000;

const server = app.listen(PORT, () => {
  winston.info(`Server running on port: ${PORT}`);
});

module.exports = server;
