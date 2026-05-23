import axios from "axios";

const API = axios.create({
  baseURL:
"https://video-platform-dcx6.onrender.com/api",
});


// Automatically attach token
API.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);

export default API;