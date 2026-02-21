import React, { useState, useEffect } from "react";
import { fetchEvents, importEvent } from "../api";
import API from "../api";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  List,
  Mail,
  ExternalLink,
  X,
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    startDate: "",
    endDate: "",
    city: "Sydney",
    isAdmin: "true",
  });

  useEffect(() => {
    if (activeTab === "events") {
      loadEvents();
    } else {
      loadLeads();
    }
  }, [filters, activeTab]);

  const loadEvents = async () => {
    try {
      const { data } = await fetchEvents(filters);
      setEvents(data);
    } catch (err) {
      console.error("Error loading events:", err);
    }
  };

  const loadLeads = async () => {
    try {
      // Fetches user email capture data
      const { data } = await API.get("/api/leads");
      setLeads(data);
    } catch (err) {
      console.error("Error loading leads:", err);
    }
  };

  const handleImport = async (id) => {
    const importNotes = "Standard Assignment Import";
    console.log("🖱️ Import Clicked for ID:", id);
    try {
      const response = await importEvent(id, importNotes);
      console.log("📦 Server Response:", response.data);
      alert("Event Imported Successfully!");
      loadEvents();
    } catch (err) {
      console.error(
        " Frontend Import Error:",
        err.response?.data || err.message,
      );
      alert(`Import Failed: ${err.response?.data?.error || "Check Console"}`);
    }
  };

  const clearDates = () => {
    setFilters({ ...filters, startDate: "", endDate: "" });
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-6">
        <h1 className="text-xl font-black mb-10 tracking-tighter">
          ADMIN PANEL
        </h1>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("events")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === "events" ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <List size={20} /> Event Pipeline
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === "leads" ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Users size={20} /> User Leads
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-8 bg-white border-b border-gray-100 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {activeTab === "events"
                ? "Scraped Event Pipeline"
                : "Captured User Leads"}
            </h2>
            <a
              href="/"
              className="text-xs font-bold text-gray-400 hover:text-black uppercase"
            >
              Public Site
            </a>
          </div>

          {activeTab === "events" && (
            <div className="flex flex-wrap gap-4 items-center">
              {/* Keyword Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                <input
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black"
                  placeholder="Search title, venue, or description..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              {/* Status Tag Filter */}
              <select
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status Tags</option>
                <option value="new">NEW</option>
                <option value="updated">UPDATED</option>
                <option value="inactive">INACTIVE</option>
                <option value="imported">IMPORTED</option>
              </select>

              {/* Date Range Filter */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                <input
                  type="date"
                  className="bg-transparent text-sm outline-none"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="date"
                  className="bg-transparent text-sm outline-none"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
                {(filters.startDate || filters.endDate) && (
                  <button
                    onClick={clearDates}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {activeTab === "events" ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Event Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      onClick={() => setSelectedEvent(event)}
                      className={`hover:bg-gray-50/50 cursor-pointer transition ${selectedEvent?._id === event._id ? "bg-gray-50" : ""}`}
                    >
                      <td className="px-6 py-5">
                        <p className="font-bold text-sm">{event.title}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          {event.venue?.name}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-black border uppercase 
                          ${
                            event.status === "new"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : event.status === "updated"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : event.status === "imported"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-rose-50 text-rose-600 border-rose-100"
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImport(event._id);
                          }}
                          disabled={event.status === "imported"}
                          className={`text-xs font-black uppercase tracking-tighter hover:underline ${event.status === "imported" ? "text-emerald-500" : "text-black"}`}
                        >
                          {event.status === "imported" ? "Published" : "Import"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* User Leads View */
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4">User Email</th>
                    <th className="px-6 py-4">Event Preference</th>
                    <th className="px-6 py-4 text-right">Captured Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map((lead) => (
                    <tr key={lead._id}>
                      <td className="px-6 py-5 font-bold text-sm flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />{" "}
                        {lead.email}
                      </td>
                      <td className="px-6 py-5 text-gray-500 text-xs">
                        {lead.eventId?.title || "Direct Lead"}
                      </td>
                      <td className="px-6 py-5 text-right text-gray-400 text-[10px] font-bold">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Side Preview Panel (Click Row to View) */}
      {selectedEvent && activeTab === "events" && (
        <aside className="w-96 bg-white border-l border-gray-200 p-8 overflow-y-auto animate-in slide-in-from-right">
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-[10px] font-black text-gray-400 hover:text-black mb-6 uppercase tracking-widest"
          >
            Close Preview
          </button>
          <img
            src={selectedEvent.imageUrl}
            className="w-full h-48 object-cover rounded-2xl mb-6 shadow-xl"
            alt="Poster"
          />
          <h2 className="text-xl font-bold mb-2 leading-tight">
            {selectedEvent.title}
          </h2>
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
              <MapPin size={14} /> {selectedEvent.venue?.name}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
              <Calendar size={14} />{" "}
              {new Date(selectedEvent.date).toLocaleDateString()}
            </div>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            {selectedEvent.description}
          </p>
          <a
            href={selectedEvent.originalUrl}
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform"
          >
            View Source <ExternalLink size={14} />
          </a>
        </aside>
      )}
    </div>
  );
};

export default Dashboard;
