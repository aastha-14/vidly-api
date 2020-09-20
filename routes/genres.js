const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genres");

router.get("/", async (req, res) => {
  try {
    const result = await Genre.find().sort("name");

    if (!result)
      return res.status(404).json({ msg: "Genres not yet created." });

    res.json({ result });
  } catch (error) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await Genre.findById(req.params.id);

    if (!result) return res.status(404).json({ msg: "Genre not found" });

    res.json({ result });
  } catch (error) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

router.post("/", async (req, res) => {
  try {
    const result = validate(req.body);
    if (result.error)
      return res.status(400).json(result.error.details[0].message);

    // Adding to db
    const genre = await new Genre({ genre: result.value.genre });
    await genre.save();

    res.json({ genre });
  } catch (error) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = validate(req.body);

    if (result.error)
      return res.status(400).json(result.error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        genre: result.value.genre,
      },
      { new: true }
    );
    if (!genre) return res.status(404).json({ msg: "Invalid genre id" });

    res.json({ genre });
  } catch (error) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).json({ msg: "genre does not exists" });
    res.json({ msg: "Genre deleted." });
  } catch (error) {
    res.status(400).json({ msg: `${e.message}` });
  }
});

module.exports = router;
