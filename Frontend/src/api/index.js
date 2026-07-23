import axios from "axios"

const API_URL = import.meta.env.VITE_API || "http://localhost:3000";  

export const api =  axios.create({
    baseURL: `${API_URL}/api/v1`
})


//interceptors to add jwt token to the header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

// clear a dead/expired token so the app doesn't keep sending it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
);
