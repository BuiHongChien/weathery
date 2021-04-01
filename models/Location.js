const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  cod: Number,
  coord: {
    lon: Number,
    lat: Number,
  },
  main: {
    temp: Number,
    feels_like: Number,
    humidity: Number,
    pressure: Number,
  },
  name: String,
  sys: {
    country: String,
  },
  weather: [{
    description: String,
    icon: String,
  }],
  wind: {
    speed: Number,
  },
  isFavorite:Boolean,
  isCurrentLocation:Boolean,
});

const Location = mongoose.model("Location", LocationSchema);

module.exports={Location}