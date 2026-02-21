require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes"); // ✅ Verify this path!
const eventRoutes = require("./routes/eventRoutes");

// Import Passport Config
require("./config/passport");

const app = express();

// --- 1. CORS Configuration ---
const allowedOrigins = [
  "https://sydney-events-sigma.vercel.app",
  "https://sydney-events-git-main-amanas96s-projects.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

app.use(cors(corsOptions));

// --- 2. Body Parsing Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Add this for form data

// --- 3. Session & Passport Setup ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sydney_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
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

// --- 5. TEST ROUTE (for debugging) ---
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!", timestamp: new Date() });
});

// --- 6. Route Delegation (MUST be AFTER session setup!) ---
console.log("📍 Registering /auth routes..."); // ✅ Debug log
app.use("/auth", authRoutes);

console.log("📍 Registering /api routes..."); // ✅ Debug log
app.use("/api", eventRoutes);

// --- 7. 404 Handler (MUST be AFTER all routes!) ---
app.use((req, res, next) => {
  console.log(`❌ 404: ${req.method} ${req.url}`); // ✅ Debug log
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.url}`,
    availableRoutes: [
      "GET /test",
      "GET /auth/google",
      "GET /auth/google/callback",
      "GET /auth/current_user",
      "GET /auth/logout",
      "GET /api/dashboard",
    ],
  });
});

// --- 8. Global Error Handling ---
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// --- 9. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`🔐 Auth Base: http://localhost:${PORT}/auth`);
});
