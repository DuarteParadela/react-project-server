const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const demandSchema = new Schema({
  status: {
    type: String,
    enum: ["Pending", "Validated", "Closed", "Rejected"],
    default: "Pending",
  },
  messageFromGuest: String,
  messagefromHelper: String,
  helper: String,
  requestDate: Date,
  tempAddress: String,
  tempZipCode: String,
  tempCity: String,
  numOfChildren: Number,
  numOfAnimals: Number,
  additionalInformation: String,
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  id_home: {
    type: Schema.Types.ObjectId,
    ref: "Home",
  },
});

const Demand = mongoose.model("Demand", demandSchema);

module.exports = Demand;
