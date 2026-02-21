import React, { useState, useEffect } from "react";
import { fetchEvents, getTickets } from "../api";
import EventCard from "../components/eventCard";
import { Loader2, CalendarX, Search, Ticket, X } from "lucide-react";

export default function PublicPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [consent, setConsent] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load data with search filtering
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Explicitly passing isAdmin: false to trigger the public status filter
        const res = await fetchEvents({
          isAdmin: false,
          search: searchTerm,
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      loadData();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Open modal handler
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Submit Lead handler
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return alert("Please agree to the terms to continue.");
    setSubmitting(true);
    try {
      await getTickets({
        email,
        eventId: selectedEvent._id,
        consent: true,
      });
      window.open(selectedEvent.originalUrl, "_blank");
      setIsModalOpen(false);
      setEmail("");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="p-6 bg-white/80 backdrop-blur-md border-b flex flex-col md:flex-row justify-between items-center sticky top-0 z-40 gap-4">
        <h1 className="text-2xl font-black tracking-tighter">SYDNEY EVENTS</h1>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search 28+ events in Sydney..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <a
          href="https://sydney-event-backend.onrender.com/auth/google"
          className="text-sm font-bold px-6 py-2.5 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all whitespace-nowrap"
        >
          Admin Login
        </a>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {loading && events.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-black mb-4" size={48} />
            <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">
              Refreshing Sydney Events...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-[40px] p-20 flex flex-col items-center text-center">
            <CalendarX className="text-gray-200 mb-6" size={80} />
            <h2 className="text-3xl font-bold mb-2">No Events Found</h2>
            <p className="text-gray-500 max-w-md">
              We couldn't find anything matching "{searchTerm}". Try a different
              keyword or check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onTicketClick={() => handleOpenModal(event)}
              />
            ))}
          </div>
        )}
      </main>

      {/* TICKET MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition"
            >
              <X size={24} />
            </button>

            <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Ticket className="text-black" size={32} />
            </div>

            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">
              Get Tickets
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Enter your email to secure your spot for{" "}
              <span className="text-black font-bold">
                {selectedEvent?.title}
              </span>
              .
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all outline-none font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-start gap-3 py-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 w-4 h-4 border-gray-300 rounded text-black focus:ring-black"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <label
                  htmlFor="consent"
                  className="text-xs text-gray-500 leading-tight"
                >
                  I agree to share my email and receive updates about this
                  event.
                </label>
              </div>

              <button
                disabled={submitting}
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-gray-200"
              >
                {submitting ? "Processing..." : "Continue to Provider"}
              </button>

              <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter">
                By continuing, you agree to share your email with the event
                organizer.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
