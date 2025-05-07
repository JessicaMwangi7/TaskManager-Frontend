import axios from "axios";
import { toast } from "react-toastify";

//base API client
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_DEV,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  retries: 3,
});

//  request interceptor to add the token
apiClient.interceptors.request.use(async (config) => {
  try {
    //token from Clerk first
    let token = await window.Clerk?.session?.getToken();

    // Fallback to localStorage if Clerk token isn't available
    if (!token) {
      token = localStorage.getItem("authToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error("Error getting auth token:", error);
    // Continue without token rather than rejecting the request
    return config;
  }
});

//response interceptor for error handling and retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if specific error cases
    if (
      originalRequest._retry ||
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 429) // rate limit errors
    ) {
      //  unauthorized access
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }

      // error message using toast
      const message = error.response?.data?.message || "An error occurred";
      toast.error(message);

      return Promise.reject(error);
    }

    // Retry logic for network errors, timeouts, or if retries are explicitly set
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    //if we've maxed out the total number of retries
    const maxRetries = originalRequest.retries || 3;
    if (originalRequest._retryCount >= maxRetries) {
      // error message using toast
      const message = error.response?.data?.message || "An error occurred";
      toast.error(message);

      return Promise.reject(error);
    }

    // retry count
    originalRequest._retryCount += 1;
    originalRequest._retry = true;

    // new promise to handle exponential backoff with increasing delay
    const delay = Math.min(1000 * 2 ** originalRequest._retryCount, 10000);
    console.log(
      `Retrying request (${originalRequest._retryCount}/${maxRetries}) after ${delay}ms...`,
    );

    //  promise in which recalls axios to retry the request
    return new Promise((resolve) => {
      setTimeout(() => resolve(apiClient(originalRequest)), delay);
    });
  },
);

// API methods for recurring transactions
export const getRecurringTransactions = () =>
  apiClient.get("/api/recurring-transactions");
export const createRecurringTransaction = (data) =>
  apiClient.post("/api/recurring-transactions", data);
export const updateRecurringTransaction = (id, data) =>
  apiClient.put(`/api/recurring-transactions/${id}`, data);
export const deleteRecurringTransaction = (id) =>
  apiClient.delete(`/api/recurring-transactions/${id}`);

// API methods for reports
export const getReports = () => apiClient.get("/api/reports");
export const createReport = (data) => apiClient.post("/api/reports", data);
export const deleteReport = (id) => apiClient.delete(`/api/reports/${id}`);

//  API methods for shared wallets
export const getSharedWallets = () => apiClient.get("/api/shared-wallets");
export const shareWallet = (data) =>
  apiClient.post("/api/shared-wallets", data);
export const updateSharedWallet = (id, data) =>
  apiClient.put(`/api/shared-wallets/${id}`, data);
export const removeSharedWallet = (id) =>
  apiClient.delete(`/api/shared-wallets/${id}`);

export default apiClient;
