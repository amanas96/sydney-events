const mongoose = require("mongoose");
const ticketLeadSchema = new mongoose.Schema({
  email: String,
  consent: Boolean,
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  createdAt: { type: Date, default: Date.now },
});
// const TicketLead = mongoose.model("TicketLead", ticketLeadSchema);

module.exports = mongoose.model("TicketLead", ticketLeadSchema);
