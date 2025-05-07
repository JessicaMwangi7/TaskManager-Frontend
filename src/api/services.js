import { createSupabaseClient } from "./auth";
import apiClient from "./client";

// Wallet services
export const walletService = {
  // all wallets for the current user
  getAll: async () => {
    try {
      const response = await apiClient.get("/api/wallets");
      return response.data;
    } catch (error) {
      console.error("Error fetching wallets:", error);
      throw error;
    }
  },

  //  specific wallet by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/wallets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching wallet ${id}:`, error);
      throw error;
    }
  },

  // new wallet
  create: async (data) => {
    try {
      const response = await apiClient.post("/api/wallets", data);
      return response.data;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw error;
    }
  },

  // Update an existing wallet
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/wallets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating wallet ${id}:`, error);
      throw error;
    }
  },

  // Delete a wallet
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/wallets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting wallet ${id}:`, error);
      throw error;
    }
  },

  //wallet data from Supabase
  getFromSupabase: async (userId) => {
    try {
      const supabase = await createSupabaseClient();
      const { data, error } = await supabase
        .from("user_data")
        .select("data")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data?.data?.wallets || [];
    } catch (error) {
      console.error("Error fetching wallets from Supabase:", error);
      throw error;
    }
  },

  // wallet data to Supabase
  saveToSupabase: async (userId, wallets) => {
    try {
      const supabase = await createSupabaseClient();

      // check if user data exists
      const { data: existingData, error: fetchError } = await supabase
        .from("user_data")
        .select("data")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingData) {
        // Update existing data
        const { error } = await supabase
          .from("user_data")
          .update({
            data: {
              ...existingData.data,
              wallets: wallets,
            },
          })
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Insert new data
        const { error } = await supabase.from("user_data").insert({
          user_id: userId,
          data: { wallets: wallets },
        });

        if (error) throw error;
      }

      return wallets;
    } catch (error) {
      console.error("Error saving wallets to Supabase:", error);
      throw error;
    }
  },
};

// Transaction services
export const transactionService = {
  // all transactions with optional filtering
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get("/api/transactions", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  // transaction by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw error;
    }
  },

  // new transaction
  create: async (data) => {
    try {
      const response = await apiClient.post("/api/transactions", data);
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  // Update an existing transaction
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/transactions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error);
      throw error;
    }
  },

  // Delete a transaction
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting transaction ${id}:`, error);
      throw error;
    }
  },
};

// Budget services
export const budgetService = {
  //all budgets for the current user
  getAll: async (walletId = null) => {
    try {
      const params = walletId ? { wallet_id: walletId } : {};
      const response = await apiClient.get("/api/budgets", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching budgets:", error);
      throw error;
    }
  },

  //  budget by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/budgets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error);
      throw error;
    }
  },

  // Create a new budget
  create: async (data) => {
    try {
      const response = await apiClient.post("/api/budgets", data);
      return response.data;
    } catch (error) {
      console.error("Error creating budget:", error);
      throw error;
    }
  },

  // existing budget update
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/api/budgets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating budget ${id}:`, error);
      throw error;
    }
  },

  // Delete a budget
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/budgets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting budget ${id}:`, error);
      throw error;
    }
  },
};

// Category services
export const categoryService = {
  // all categories
  getAll: async () => {
    try {
      const response = await apiClient.get("/api/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get a specific category by ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  // Create a new category
  create: async (data) => {
    try {
      const response = await apiClient.post("/api/categories", data);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },
};

// Notification services
export const notificationService = {
  // notifications for the current user
  getAll: async () => {
    try {
      const response = await apiClient.get("/api/notifications");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Mark a notification as read
  markAsRead: async (id) => {
    try {
      const response = await apiClient.put(`/api/notifications/${id}`, {
        is_read: true,
      });
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.get("/api/notifications", {
        params: { mark_all_read: true },
      });
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete a notification
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/api/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  },
};
