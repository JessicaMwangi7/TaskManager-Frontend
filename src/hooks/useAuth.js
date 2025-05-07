import { useUser, useClerk, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { createSupabaseClient } from "../api/auth";

export const useAuth = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { session } = useSession();
  const navigate = useNavigate();
  const { setUser, clearUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Sync Clerk user with our store and Supabase
  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && user) {
        try {
          setIsLoading(true);
          const userData = {
            email: user.primaryEmailAddress?.emailAddress || "",
            full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            avatar_url: user.imageUrl || "",
          };

          // Try to sync with Supabase
          try {
            const supabase = await createSupabaseClient();

            // Use RPC function to handle upsert properly
            const { error } = await supabase.rpc("insert_or_update_user_data", {
              p_user_id: user.id,
              p_email: userData.email,
              p_data: userData,
            });

            if (error) {
              console.error("Error upserting user data in Supabase:", error);

              // Fallback to manual check and insert/update if RPC fails
              const { data: existingData, error: fetchError } = await supabase
                .from("user_data")
                .select("*")
                .eq("user_id", user.id)
                .maybeSingle();

              if (fetchError && fetchError.code !== "PGRST116") {
                console.error("Error checking user in Supabase:", fetchError);
              }

              if (existingData) {
                // Update existing record
                const { error: updateError } = await supabase
                  .from("user_data")
                  .update({
                    email: userData.email,
                    data: userData,
                  })
                  .eq("user_id", user.id);

                if (updateError) {
                  console.error("Error updating user data:", updateError);
                }
              } else {
                // Insert new record
                const { error: insertError } = await supabase
                  .from("user_data")
                  .insert({
                    user_id: user.id,
                    email: userData.email,
                    data: userData,
                  });

                if (insertError) {
                  console.error("Error inserting user data:", insertError);
                }
              }
            }

            // Store user data in our frontend store
            setUser({
              id: user.id,
              email: userData.email,
              fullName: userData.full_name,
              clerkUserId: user.id,
              imageUrl: userData.avatar_url,
              firstName: user.firstName || "",
              lastName: user.lastName || "",
              supabaseData: userData,
            });
          } catch (supabaseError) {
            console.error("Error with Supabase operations:", supabaseError);
            setUser({
              id: user.id,
              email: userData.email,
              fullName: userData.full_name,
              clerkUserId: user.id,
              imageUrl: userData.avatar_url,
              firstName: user.firstName || "",
              lastName: user.lastName || "",
            });
          }
        } catch (error) {
          console.error("Error in overall sync process:", error);
          setUser({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            clerkUserId: user.id,
            imageUrl: user.imageUrl || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        clearUser();
        setIsLoading(false);
      }
    };

    syncUser();
  }, [isSignedIn, user, setUser, clearUser]);

  const logout = async () => {
    try {
      await signOut();
      clearUser();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  return {
    user: useAuthStore.getState().user,
    isAuthenticated: isSignedIn,
    isLoading,
    logout,
    session,
  };
};

export default useAuth;
