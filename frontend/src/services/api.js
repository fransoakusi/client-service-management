import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5001", // Replace with your backend URL if necessary
});

// Intercept requests to include authentication tokens if needed
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createUser = (data) => API.post("/admin/create-user", data);
export const login = (data) => API.post("/auth/login", data);
export const getUserProfile = () => API.get("/user/profile");
