import api, {
  createSupabaseClient,
  registerUser,
  getCurrentUser,
} from "./auth";
import apiClient from "./client";
import { endpoints } from "./endpoints";
import {
  walletService,
  transactionService,
  budgetService,
  categoryService,
  notificationService,
} from "./services";

// everything for backward compatibility
export {
  api,
  apiClient,
  createSupabaseClient,
  registerUser,
  getCurrentUser,
  walletService,
  transactionService,
  budgetService,
  categoryService,
  notificationService,
};

//  endpoints API
export const apiService = endpoints;

// Default export
export default api;
