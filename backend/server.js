require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

// Import Passport Config
require("./config/passport");

const app = express();

// --- 1. Middleware ---
app.use(express.json()); // Parses incoming JSON requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// --- 2. Session & Passport Setup ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sydney_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// --- 3. MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Sydney Events DB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

mongoose.connection.once("open", async () => {
  const count = await mongoose.connection.db
    .collection("events")
    .countDocuments();
  console.log(`🔎 Total documents found in 'events' collection: ${count}`);
});

// --- 4. Route Delegation ---

// Auth routes handle /auth/google, /auth/logout, etc.
app.use("/auth", authRoutes);

// API routes handle /api/dashboard, /api/tickets, /api/events/:id/import
app.use("/api", eventRoutes);

// --- 5. Global Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong on the server!" });
});

// --- 6. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
});
