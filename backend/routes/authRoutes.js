const express = require("express");
const passport = require("passport");
const router = express.Router();

// Trigger Google Login
console.log("✅ authRoutes.js loaded!"); // ✅ Debug log

// Trigger Google Login
router.get("/google", (req, res, next) => {
  console.log("🔐 /auth/google route hit!"); // ✅ Debug log
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );
});

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect to the frontend admin dashboard
    res.redirect(process.env.FRONTEND_URL + "/dashboard");
  },
);

// Get currently logged in user
router.get("/current_user", (req, res) => {
  res.send(req.user);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
});

console.log("✅ authRoutes exported!");

module.exports = router;
