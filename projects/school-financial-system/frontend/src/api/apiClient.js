import axios from "axios";

/**
 * API Client Configuration - CRITICAL
 * 
 * Uses Vite dev proxy to avoid CORS issues in development.
 * Frontend makes requests to http://localhost:5173/api/* (same origin)
 * Vite proxies them to http://localhost:5000/api/* (backend preserves path)
 * 
 * Environment Variable:
 * - VITE_API_BASE_URL (optional - overrides /api)
 * 
 * Route Pattern:
 * - Routes use /api prefix: /api/finance/transactions
 * - Resolves in browser to: http://localhost:5173/api/finance/transactions
 * - Vite proxies to backend: http://localhost:5000/api/finance/transactions
 */

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const normalizedBaseUrl =
  configuredBaseUrl && configuredBaseUrl.startsWith("https://localhost")
    ? configuredBaseUrl.replace("https://", "http://")
    : configuredBaseUrl;

const apiClient = axios.create({
  baseURL: normalizedBaseUrl || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
