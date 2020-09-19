const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Genre = require("../models/genres");

function validateGenres(genre) {
  const genres = Joi.object({ genre: Joi.string().required() });
  return genres.validate(genre);
}

router.get("/", async (req, res) => {
  const result = await Genre.find().sort("name");

  if (!result) return res.status(404).json({ msg: "Genres not yet created." });

  res.json({ result });
});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const result = await Genre.findById(req.params.id);

  if (!result) return res.status(404).json({ msg: "Genre not found" });
  res.json({ result });
});

router.post("/", async (req, res) => {
  try {
    const result = validateGenres(req.body);
    if (result.error)
      return res.status(400).json(result.error.details[0].message);

    // Adding to db
    const genre = await new Genre({ genre: result.value.genre });
    await genre.save();

    res.json({ genre });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ msg: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = validateGenres(req.body);

    if (result.error)
      return res.status(400).json(result.error.details[0].message);

    const genre = await Genre.findOneAndUpdate(
      req.params.id,
      {
        genre: result.value.genre,
      },
      { new: true }
    );
    if (!genre) return res.status(404).json({ msg: "Invalid genre id" });

    res.json({ genre });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ msg: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).json({ msg: "genre does not exists" });
    res.json({ msg: "Genre deleted." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Server error" });
  }
});

module.exports = router;
