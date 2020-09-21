const winston = require("winston");

module.exports = function (error, req, res, next) {
  winston.error(error.message, error);
  //error
  // warn
  // info
  // verbose
  // debug
  // silly
  res.status(500).json({ msg: "Something failed." });
};
