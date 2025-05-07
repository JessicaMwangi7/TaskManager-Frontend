import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/api/services";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

export function useWallets() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  //  all wallets
  const walletsQuery = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.getAll,
    enabled: !!user?.id,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    onError: (error) => {
      console.error("Error fetching wallets:", error);
    },
  });

  // Create wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: walletService.create,
    onSuccess: () => {
      toast.success("Wallet created successfully");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create wallet");
    },
  });

  // Update wallet mutation
  const updateWalletMutation = useMutation({
    mutationFn: ({ id, data }) => walletService.update(id, data),
    onSuccess: () => {
      toast.success("Wallet updated successfully");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update wallet");
    },
  });

  // Delete wallet mutation
  const deleteWalletMutation = useMutation({
    mutationFn: walletService.delete,
    onSuccess: () => {
      toast.success("Wallet deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete wallet");
    },
  });

  // Sync with Supabase
  const syncWithSupabaseMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      //  wallets from API
      const apiWallets = await walletService.getAll();

      // Save to Supabase
      return walletService.saveToSupabase(user.id, apiWallets);
    },
    onSuccess: () => {
      toast.success("Wallets synced with Supabase");
    },
    onError: (error) => {
      toast.error("Failed to sync wallets with Supabase");
      console.error(error);
    },
  });

  return {
    wallets: walletsQuery.data || [],
    isLoading: walletsQuery.isLoading,
    isError: walletsQuery.isError,
    error: walletsQuery.error,
    createWallet: createWalletMutation.mutate,
    updateWallet: updateWalletMutation.mutate,
    deleteWallet: deleteWalletMutation.mutate,
    syncWithSupabase: syncWithSupabaseMutation.mutate,
    isSyncing: syncWithSupabaseMutation.isPending,
    isPending:
      createWalletMutation.isPending ||
      updateWalletMutation.isPending ||
      deleteWalletMutation.isPending,
  };
}
