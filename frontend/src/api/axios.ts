import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const stored = sessionStorage.getItem("retail_auth_user");
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as { token?: string };
      if (parsed.token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization =
          `Bearer ${parsed.token}`;
      }
    } catch {
      // Ignore malformed session state and continue without auth header.
    }
  }

  return config;
});

export default api;
