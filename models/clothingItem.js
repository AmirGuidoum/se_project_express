const mongoose = require("mongoose");
const validator = require("validator");

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return validator.isURL(v);
        message: "Link is not";
      },
    },
  },
});

module.exports = mongoose.model("clothingItems", clothingItem);
