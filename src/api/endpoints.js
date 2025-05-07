import apiClient from "./client";

// API functions ()-> resource
export const endpoints = {
  // User endpoints
  user: {
    getCurrent: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
    update: async (data) => {
      const response = await apiClient.patch("/users/me", data);
      return response.data;
    },
  },

  // Wallet endpoints
  wallets: {
    getAll: async () => {
      const response = await apiClient.get("/wallets");
      return response.data;
    },
    getById: async (id) => {
      const response = await apiClient.get(`/wallets/${id}`);
      return response.data;
    },
    create: async (data) => {
      const response = await apiClient.post("/wallets", data);
      return response.data;
    },
    update: async (id, data) => {
      const response = await apiClient.patch(`/wallets/${id}`, data);
      return response.data;
    },
    delete: async (id) => {
      const response = await apiClient.delete(`/wallets/${id}`);
      return response.data;
    },
  },

  // Transaction
  transactions: {
    getAll: async (params) => {
      const response = await apiClient.get("/transactions", { params });
      return response.data;
    },
    getById: async (id) => {
      const response = await apiClient.get(`/transactions/${id}`);
      return response.data;
    },
    create: async (data) => {
      const response = await apiClient.post("/transactions", data);
      return response.data;
    },
    update: async (id, data) => {
      const response = await apiClient.patch(`/transactions/${id}`, data);
      return response.data;
    },
    delete: async (id) => {
      const response = await apiClient.delete(`/transactions/${id}`);
      return response.data;
    },
  },

  // Supabase data
  supabase: {
    getUserData: async (supabase, userId) => {
      const { data, error } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    updateUserData: async (supabase, userId, data) => {
      const { data: result, error } = await supabase
        .from("user_data")
        .update({ data })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    createUserData: async (supabase, userId, data) => {
      const { data: result, error } = await supabase
        .from("user_data")
        .insert({
          user_id: userId,
          data,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
  },
};

export default endpoints;
