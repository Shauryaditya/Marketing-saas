import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const setupAxiosInterceptors = (navigate) => {
  // Request Interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.baseURL = apiUrl;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  axios.interceptors.response.use(
    (response) => {
      // If the response is successful, simply return the response
      return response;
    },
    (error) => {
      // Check for a 401 Unauthorized status code
      if (error.response && error.response.status === 401) {
        // Clear local storage or any other cleanup if necessary
        localStorage.removeItem("access_token");

        // Reload the page to ensure the state is reset
        window.location.reload();

        // Alternatively, use navigate to redirect directly
        navigate("/sign-in");
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
