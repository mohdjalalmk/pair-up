const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index — auto-deletes when `expiresAt` is reached
  },
});

module.exports = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
