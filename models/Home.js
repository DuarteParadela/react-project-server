const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeSchema = new Schema({
  address: String,
  city: String,
  zipcode: String,
  acceptsChildren: Boolean,
  isAvalaible: Boolean,
  acceptsAnimals: Boolean,
});

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
