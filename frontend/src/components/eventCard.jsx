// src/components/EventCard.jsx
import React from "react";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

export default function EventCard({ event, onTicketClick }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            event.imageUrl ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          {event.sourceSite || "Sydney"}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.title}</h3>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <MapPin size={14} />
            <span className="line-clamp-1">
              {event.venue?.name || "Sydney CBD"}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onTicketClick(event);
          }}
          className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
        >
          GET TICKETS
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
