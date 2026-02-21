// src/components/AdminTable.jsx
import React from "react";

export default function AdminTable({ events, onRowClick, onImport }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "updated":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "inactive":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "imported":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-left">
            <th className="px-6 py-4 text-sm font-semibold text-gray-400">
              EVENT
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-400">
              SOURCE
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-400">
              STATUS
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-400 text-right">
              ACTION
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {events.map((event) => (
            <tr
              key={event._id}
              onClick={() => onRowClick(event)}
              className="group hover:bg-gray-50/50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-5">
                <p className="font-bold text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">
                  {event.venue?.name}
                </p>
              </td>
              <td className="px-6 py-5 text-sm text-gray-500">
                {event.sourceSite}
              </td>
              <td className="px-6 py-5">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusStyle(event.status)}`}
                >
                  {event.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents row click (preview) from firing
                    onImport(event._id);
                  }}
                  disabled={event.status === "imported"}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all
                    ${
                      event.status === "imported"
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-black text-black hover:bg-black hover:text-white"
                    }`}
                >
                  {event.status === "imported" ? "Imported" : "Import"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
