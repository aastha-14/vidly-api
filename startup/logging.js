const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  process.on("unhandledRejection", (ex) => {
    winston.transports.Console({ colorize: true, prettyPrint: true });
    winston.error(ex.message, ex);
    process.exit(1);
  });
  // process.on("uncaughtException", (ex) => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });
  winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: "handleException.log",
        handleExceptions: true,
      }),
      new winston.transports.File({ filename: "logfile.log" }),
      new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" }),
    ],
  });
};
