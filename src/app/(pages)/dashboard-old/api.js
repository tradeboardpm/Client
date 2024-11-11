import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchJournals = () => api.get("/journal");
export const createJournal = (data) => api.post("/journal", data);
export const updateJournal = (id, data) => api.put(`/journal/${id}`, data);

export const fetchRules = () => api.get("/rules");
export const createRule = (rule) => api.post("/rules", { description: rule });
export const updateRule = (id, rule) => api.put(`/rules/${id}`, { description: rule });
export const deleteRule = (id) => api.delete(`/rules/${id}`);

export const fetchTrades = () => api.get("/trades");
export const createTrade = (trade) => api.post("/trades", trade);
export const updateTrade = (id, trade) => api.put("/trades", { id, ...trade });
export const deleteTrade = (id) => api.delete(`/trades/${id}`);

export default api;
