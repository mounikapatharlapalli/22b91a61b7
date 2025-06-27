const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  shortUrlId: { type: mongoose.Schema.Types.ObjectId, ref: "ShortURL" },
  timestamp: { type: Date, default: Date.now },
  referer: String,
  location: String,
});

module.exports = mongoose.model("Click", ClickSchema);
