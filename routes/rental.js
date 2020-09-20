const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Fawn = require("fawn");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movies");

const { Genre } = require("../models/genres");
Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.json({ rentals });
});

router.post("/", async (req, res) => {
  try {
    const result = validate(req.body);
    if (result.error)
      return res.status(400).json(result.error.details[0].message);
    const { customerId, movieId } = result.value;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(400).json({ msg: "Invalid customer id" });

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(400).json({ msg: "Invalid movie id" });

    if (movie.numberInStock === 0)
      res.status(400).json({ msg: "Movie not in stock" });

    const { name, phone, isGold } = customer;
    const { title, dailyRentalRate } = movie;
    let rental = new Rental({
      customer: {
        _id: customer._id,
        name,
        phone,
        isGold,
      },
      movie: {
        _id: movie._id,
        title,
        dailyRentalRate,
      },
    });
    // rental = await rental.save();
    // movie.numberInStock--;
    // await movie.save();

    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.json({ rental });
  } catch (e) {
    res.status(400).json({ error: `${e.message}` });
  }
});
module.exports = router;
