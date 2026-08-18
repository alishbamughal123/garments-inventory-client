import axios from "axios";

const apiBaseURL =
  import.meta.env.VITE_API_URL || "https://garments-inventory-server.onrender.com/api/v1";

const api = axios.create({
  baseURL: apiBaseURL,
});

api.interceptors.request.use(
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
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error?.config?.url?.includes("/auth/login") ||
      error?.config?.url?.includes("/portal/login") ||
      error?.config?.url?.includes("/portal/register") ||
      error?.config?.url?.includes("/portal/google-auth");

    if (
      error?.response?.status === 401 &&
      !isAuthEndpoint
    ) {
      localStorage.removeItem(
        "token"
      );
      localStorage.removeItem(
        "user"
      );

      if (
        window.location.pathname !==
        "/login"
      ) {
        window.location.assign(
          "/login"
        );
      }
    }

    return Promise.reject(error);
  }
);

export const buildQueryParams = (
  filters = {}
) =>
  Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) =>
        value !== undefined &&
        value !== null &&
        value !== ""
    )
  );

export default api;
