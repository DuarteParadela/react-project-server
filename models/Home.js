const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  acceptsChildren: Boolean,
  acceptsAnimals: Boolean,
  isAvailable: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    required: true,
  },
  numOfRooms: {
    type: Number,
    required: true,
  },
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  id_demand: {
    type: Schema.Types.ObjectId,
    ref: "Demand",
  },
});

const Home = mongoose.model("Home", homeSchema);

module.exports = Home;
