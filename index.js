const mongoose = require("mongoose");
const express = require("express");
const app = express();
const morgan = require("morgan");
const config = require("config");

mongoose.connect(
  "mongodb://localhost/vidly",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  () => console.log("Connected to MongoDB...")
);

app.use(express.json());
// console.log(config.get('password'));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

app.use("/api/genres", require("./routes/genres"));
app.use("/api/customer", require("./routes/customer"));
app.use("/api/movies", require("./routes/movies"));
app.use("/api/rental", require("./routes/rental"));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
