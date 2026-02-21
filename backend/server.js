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

// --- 1. CORS CONFIGURATION (MUST BE FIRST!) ---
const allowedOrigins = [
  "https://sydney-events-sigma.vercel.app",
  "https://sydney-events-git-main-amanas96s-projects.vercel.app",
  "http://localhost:5173", // ✅ Add for Vite dev
];

// Add environment variable if exists
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ Added OPTIONS
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // ✅ Added headers
  optionsSuccessStatus: 200,
};

// ✅ Apply CORS BEFORE any other middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handle preflight requests

// --- 2. Other Middleware ---
app.use(express.json()); // Now comes AFTER CORS

// --- 3. Session & Passport Setup ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sydney_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === "production", // ✅ Fixed: true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true, // ✅ Added for security
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// --- 4. MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Sydney Events DB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

mongoose.connection.once("open", async () => {
  const count = await mongoose.connection.db
    .collection("events")
    .countDocuments();
  console.log(`📊 Total documents found in 'events' collection: ${count}`);
});

// --- 5. Route Delegation ---

// Auth routes handle /auth/google, /auth/logout, etc.
app.use("/auth", authRoutes);

// API routes handle /api/dashboard, /api/tickets, /api/events/:id/import
app.use("/api", eventRoutes);

// --- 6. Global Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong on the server!" });
});

// --- 7. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
});
