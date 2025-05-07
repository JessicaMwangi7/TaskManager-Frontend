import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { budgetService } from "@/api/services";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

export function useBudgets(walletId = null) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // all budgets
  const budgetsQuery = useQuery({
    queryKey: ["budgets", { walletId }],
    queryFn: () => budgetService.getAll(walletId),
    enabled: !!user?.id,
  });

  // Create budget mutation
  const createBudgetMutation = useMutation({
    mutationFn: budgetService.create,
    onSuccess: () => {
      toast.success("Budget created successfully");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create budget");
    },
  });

  // Update budget mutation
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, data }) => budgetService.update(id, data),
    onSuccess: () => {
      toast.success("Budget updated successfully");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update budget");
    },
  });

  // Delete budget mutation
  const deleteBudgetMutation = useMutation({
    mutationFn: budgetService.delete,
    onSuccess: () => {
      toast.success("Budget deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete budget");
    },
  });

  return {
    budgets: budgetsQuery.data || [],
    isLoading: budgetsQuery.isLoading,
    isError: budgetsQuery.isError,
    error: budgetsQuery.error,
    createBudget: createBudgetMutation.mutate,
    updateBudget: updateBudgetMutation.mutate,
    deleteBudget: deleteBudgetMutation.mutate,
    isPending:
      createBudgetMutation.isPending ||
      updateBudgetMutation.isPending ||
      deleteBudgetMutation.isPending,
  };
}
