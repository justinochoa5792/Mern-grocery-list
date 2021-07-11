const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/mern-list", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to db"))
  .catch(console.error);

const Grocery = require("./models/Grocery");

app.get("/grocery", async (req, res) => {
  const grocery = await Grocery.find();

  res.json(grocery);
});

app.post("/grocery/new", (req, res) => {
  const grocery = new Grocery({
    text: req.body.text,
  });
  grocery.save();
  res.json(grocery);
});

app.delete("/grocery/delete/:id", async (req, res) => {
  const result = await Grocery.findByIdAndDelete(req.params.id);

  res.json(result);
});

app.get("/grocery/complete/:id", async (req, res) => {
  const grocery = await Grocery.findById(req.params.id);

  grocery.complete = !grocery.complete;

  grocery.save();

  res.json(grocery);
});

app.listen(3001, () => console.log("Server started on port 3001"));
