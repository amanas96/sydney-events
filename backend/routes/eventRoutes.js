const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const TicketLead = require("../models/ticketLead");

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
};

// GET Dashboard Events (Public & Admin)
router.get("/dashboard", async (req, res) => {
  try {
    const {
      status,
      search,
      isAdmin,
      startDate,
      endDate,
      city = "Sydney",
    } = req.query;

    let query = { city };
    if (isAdmin !== "true") {
      query.status = { $in: ["new", "imported"] };
    } else if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "venue.name": { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    const events = await Event.find(query).sort({ date: 1 });

    res.json(events);
  } catch (err) {
    console.error("Dashboard Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch event data" });
  }
});

// POST Ticket Lead
router.post("/tickets", async (req, res) => {
  try {
    const { email, consent, eventId } = req.body;
    const lead = await TicketLead.create(req.body);
    console.log(` Lead captured for event: ${req.body.eventId}`);
    res.status(201).json(lead);
  } catch (err) {
    console.error(" Error saving ticket lead:", err.message);
    res
      .status(400)
      .json({ error: "Failed to save lead. Ensure all fields are present." });
  }
});

// PATCH Import (Protected)
router.patch("/events/:id/import", async (req, res) => {
  // DEBUGGING LOGS
  console.log(" IMPORT ATTEMPT START");
  console.log(" Target Event ID:", req.params.id);
  console.log(" Is Authenticated?:", req.isAuthenticated());
  console.log(" User Data:", req.user ? req.user.email : "NO USER FOUND");

  try {
    const { importNotes } = req.body;
    if (!req.isAuthenticated()) {
      console.log(" REJECTED: User not authenticated");
      return res.status(401).json({ error: "Please log in first" });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: "imported",
        importedAt: new Date(),
        importedBy: req.user.email,
        importNotes: importNotes || "Standard Import",
      },
      { new: true },
    );

    if (!event) {
      console.log(" REJECTED: Event ID not found in DB");
      return res.status(404).json({ error: "Event not found" });
    }

    console.log(" SUCCESS: Event status updated to 'imported'");
    res.json(event);
  } catch (err) {
    console.error(" CRASH:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET Captured Leads (Admin Only)
router.get("/leads", async (req, res) => {
  try {
    const leads = await TicketLead.find().populate("eventId", "title");
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

module.exports = router;
