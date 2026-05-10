const isProduction = import.meta.env.PROD;
const envUrl = import.meta.env.VITE_API_BASE_URL;

if (isProduction && !envUrl) {
  console.warn("VITE_API_BASE_URL is not defined in production environment. Falling back to localhost.");
}

export const BACKEND_URL = (envUrl || "http://localhost:5000").replace(/\/$/, "");
