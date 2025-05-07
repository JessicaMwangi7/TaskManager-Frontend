import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/api/services";
import { toast } from "react-toastify";
import useAuth from "./useAuth";

export function useTransactions(filters = {}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  //  all transactions with filters
  const transactionsQuery = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionService.getAll(filters),
    enabled: !!user?.id,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    onError: (error) => {
      console.error("Error fetching transactions:", error);
    },
  });

  // transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: transactionService.create,
    onSuccess: () => {
      toast.success("Transaction created successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // Also invalidate wallets as balance might change
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Failed to create transaction",
      );
    },
  });

  // Update transaction mutation
  const updateTransactionMutation = useMutation({
    mutationFn: ({ id, data }) => transactionService.update(id, data),
    onSuccess: () => {
      toast.success("Transaction updated successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Failed to update transaction",
      );
    },
  });

  // Delete transaction mutation
  const deleteTransactionMutation = useMutation({
    mutationFn: transactionService.delete,
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Failed to delete transaction",
      );
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    error: transactionsQuery.error,
    createTransaction: createTransactionMutation.mutate,
    updateTransaction: updateTransactionMutation.mutate,
    deleteTransaction: deleteTransactionMutation.mutate,
    isPending:
      createTransactionMutation.isPending ||
      updateTransactionMutation.isPending ||
      deleteTransactionMutation.isPending,
  };
}
