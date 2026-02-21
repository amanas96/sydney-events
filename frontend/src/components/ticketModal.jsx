// src/components/TicketModal.jsx
import React, { useState } from "react";
import API from "../api";

export default function TicketModal({ event, onClose }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return alert("Please accept the terms.");

    // Save to DB via backend
    await API.post("/api/tickets", { email, consent, eventId: event._id });

    // Redirect to original source
    window.location.href = event.originalUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">Get Tickets</h2>
        <p className="text-gray-500 mb-6">
          Enter your details for <b>{event.title}</b>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setConsent(e.target.checked)}
            />
            I agree to receive event updates (Opt-in)
          </label>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-bold"
          >
            Continue to Tickets
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-gray-400 text-sm"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
