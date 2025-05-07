import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/api/services";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

export function useCategories() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // all categories
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    enabled: !!user?.id,
    // retry configuration
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    onError: (error) => {
      console.error("Error fetching categories:", error);
    },
  });

  // category mutation
  const createCategoryMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create category");
      console.error("Error creating category:", error);
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => categoryService.update(id, data),
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to update category");
      console.error("Error updating category:", error);
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete category");
      console.error("Error deleting category:", error);
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isPending:
      createCategoryMutation.isPending ||
      updateCategoryMutation.isPending ||
      deleteCategoryMutation.isPending,
  };
}
