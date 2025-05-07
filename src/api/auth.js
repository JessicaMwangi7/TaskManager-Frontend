import axios from "axios";
import { createClient } from "@supabase/supabase-js";

//  axios instance with default config -()-> backward compatibility
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL_DEV,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, //()-> 10 seconds timeout
  retries: 3, // retry capability
});

// retry logic with exponential backoff
api.interceptors.response.use(null, async (error) => {
  const config = error.config;

  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retries) return Promise.reject(error);

  // variable for tracking retry count
  config.__retryCount = config.__retryCount || 0;

  // if we've maxed out the total number of retries
  if (config.__retryCount >= config.retries) {
    // Reject
    return Promise.reject(error);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // new promise to handle exponential backoff with increasing delay
  const backoff = new Promise((resolve) => {
    const delay = Math.min(1000 * 2 ** config.__retryCount, 10000);
    console.log(
      `Retrying request (${config.__retryCount}/${config.retries}) after ${delay}ms...`,
    );
    setTimeout(() => {
      resolve();
    }, delay);
  });

  // promise in which recalls axios to retry the request
  await backoff;
  return api(config);
});

// request interceptor to add the token
api.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error("Error getting Clerk token:", error);
    return Promise.reject(error);
  }
});

// response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //  unauthorized access
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

//  Supabase client with Clerk authentication
export const createSupabaseClient = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or anon key in environment variables");
    throw new Error("Supabase configuration is incomplete");
  }

  try {
    //  Supabase JWT from Clerk
    let token = null;
    try {
      token = await window.Clerk?.session?.getToken({
        template: "supabase",
      });
    } catch (tokenError) {
      console.error("Error getting Clerk token for Supabase:", tokenError);
      // Continue without token
    }

    // Supabase client with the token if available
    const options = {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    };

    if (token) {
      options.global = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }

    return createClient(supabaseUrl, supabaseKey, options);
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    // client without auth as fallback
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await window.Clerk?.user?.getCurrent();
    if (!user) {
      throw new Error("No authenticated user");
    }
    const response = await api.get(`/users/${user.id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

// Sign in user with email and password
export const signInUser = async (email, password) => {
  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Reset password (send reset email)
export const resetPassword = async (email) => {
  try {
    const supabase = await createSupabaseClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

// Update password with reset token
export const updatePasswordWithToken = async (newPassword) => {
  try {
    const supabase = await createSupabaseClient();

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const supabase = await createSupabaseClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) throw userError;
    if (!user) throw new Error("No user logged in");

    // Get existing user data
    const { data: existingData, error: fetchError } = await supabase
      .from("user_data")
      .select("data")
      .eq("user_id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    // Update user data
    const updatedData = {
      ...(existingData?.data || {}),
      ...userData,
      updated_at: new Date().toISOString(),
    };

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from("user_data")
        .update({ data: updatedData })
        .eq("user_id", user.id);

      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase.from("user_data").insert({
        user_id: user.id,
        email: user.email,
        data: updatedData,
      });

      if (error) throw error;
    }

    return { success: true, data: updatedData };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export default api;
