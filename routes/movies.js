const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movies");
const { Genre } = require("../models/genres");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const movie = await Movie.find().sort("genre");
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    res.json({ movie });
  } catch (e) {
    res.status(400).json({ error: `${e.message}` });
  }
});

router.get("/:movieId", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    res.json({ movie });
  } catch (e) {
    res.status(400).json({ error: `${e.message}` });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const result = validate(req.body);
    if (result.error)
      return res.status(400).json(result.error.details[0].message);

    const genres = await Genre.findById(req.body.genreId);
    if (!genres) return res.status(404).json({ msg: "Genre id is not valid" });

    const { title, numberInStock, dailyRentalRate } = result.value;

    const { _id, genre } = genres;

    const movie = await new Movie({
      title,
      numberInStock,
      dailyRentalRate,
      genre: {
        _id,
        genre,
      },
    });

    await movie.save();
    res.json({ movie });
  } catch (e) {
    res.status(400).json({ error: `${e.message}` });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const result = validate(req.body);
    if (result.error)
      return res.status(400).json(result.error.details[0].message);

    const genres = await Genre.findById(req.body.genreId);
    if (!genres) return res.status(404).json({ msg: "Genre id is not valid" });

    const { title, numberInStock, dailyRentalRate } = result.value;

    const { _id, genre } = genres;
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
      title,
      numberInStock,
      dailyRentalRate,
      genre: {
        _id,
        genre,
      },
    });
    res.json({ movie });
  } catch (e) {
    res.status(400).json({ error: `${e.message}` });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) res.status(404).json({ msg: "Movie not found" });
    res.json({ msg: "Movie deleted" });
  } catch (e) {
    res.status(400).json({ error: `${e.message}` });
  }
});
module.exports = router;
