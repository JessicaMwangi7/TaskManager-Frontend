import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export function useSupabaseData() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // ()ser data from Supabase()
  const userDataQuery = useQuery({
    queryKey: ["userData", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const supabase = await createSupabaseClient();
      const { data, error } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Update user data mutation
  const updateUserDataMutation = useMutation({
    mutationFn: async (newData) => {
      if (!user?.id) throw new Error("User not authenticated");

      const supabase = await createSupabaseClient();

      // Check if user data exists
      const { data: existingData, error: fetchError } = await supabase
        .from("user_data")
        .select("data")
        .eq("user_id", user.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

      if (existingData) {
        // Update existing data
        const { data, error } = await supabase
          .from("user_data")
          .update({
            data: {
              ...existingData.data,
              ...newData,
              updated_at: new Date().toISOString(),
            },
          })
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new data
        const { data, error } = await supabase
          .from("user_data")
          .insert({
            user_id: user.id,
            email: user.email,
            data: {
              ...newData,
              created_at: new Date().toISOString(),
            },
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      toast.success("Data updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userData", user?.id] });
    },
    onError: (error) => {
      console.error("Error updating user data:", error);
      toast.error("Failed to update data");
    },
  });

  return {
    userData: userDataQuery.data?.data || {},
    isLoading: userDataQuery.isLoading,
    isError: userDataQuery.isError,
    error: userDataQuery.error,
    updateUserData: updateUserDataMutation.mutate,
    isPending: updateUserDataMutation.isPending,
  };
}

export default useSupabaseData;
