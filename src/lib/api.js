import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const createJournal = async (formData) => {
  const response = await api.post("/journal", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getJournals = async () => {
  const response = await api.get("/journal");
  return response.data;
};

export const getRules = async () => {
  const response = await api.get("/rules");
  return response.data;
};

export const createRule = async (description) => {
  const response = await api.post("/rules", { description });
  return response.data;
};

export const updateRule = async (
  id,
  description,
  isChecked
) => {
  const response = await api.put("/rules", { id, description, isChecked });
  return response.data;
};

export const deleteRule = async (id) => {
  const response = await api.delete(`/rules/${id}`);
  return response.data;
};
