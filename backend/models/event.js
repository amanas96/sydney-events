const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: Date,
    venue: { name: String, address: String },
    city: { type: String, default: "Sydney" },
    description: String,
    originalUrl: { type: String, unique: true },
    description: String,
    category: [String],
    status: {
      type: String,
      enum: ["new", "updated", "inactive", "imported"],
      default: "new",
    },
    importedBy: String,
    importedAt: Date,
    importNotes: String,
    lastScrapedTime: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
