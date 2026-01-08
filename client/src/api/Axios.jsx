import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Handle actual 401 Unauthorized (Token Expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Access token expired. Attempting refresh...");
        
        const res = await axios.post(
          "http://localhost:8080/api/v1/auth/refresh-token",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update the header for the retry
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        
        return api(originalRequest); 
      } catch (refreshError) {
        // ONLY redirect if the refresh-token call itself returns a 401 or 403
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
          console.error("Refresh token dead. Redirecting to login.");
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // 2. Handle Network Errors (Don't redirect, just let the component handle it)
    if (error.message === "Network Error") {
      console.error("Network Error: Server might be down or CORS failed.");
      // We do NOT redirect here, which stops the "bouncing"
    }

    return Promise.reject(error);
  }
);

export default api;