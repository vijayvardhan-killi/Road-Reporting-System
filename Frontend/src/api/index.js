import axios from "axios"

export const api =  axios.create({
    baseURL:"http://localhost:3000/api/v1/"
})


//interceptors to add jwt token to the header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  