import axios from "axios";

const API = axios.create({
  baseURL: "https://sydney-event-backend.onrender.com",
  withCredentials: true,
});

export const fetchEvents = (params) =>
  API.get("/api/dashboard", { params: params });

export const importEvent = (id, importNotes) =>
  API.patch(`/api/events/${id}/import`, { importNotes });

export const getTickets = (data) => API.post("/api/tickets", data);

export const getCurrentUser = () => API.get("/api/current_user");

export default API;
