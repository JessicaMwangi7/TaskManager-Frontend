import { useState, useEffect } from "react";
import {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} from "@/api/client";
import { toast } from "react-toastify";

export function useRecurringTransactions() {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const fetchRecurringTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await getRecurringTransactions();
      setRecurringTransactions(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch recurring transactions");
      toast.error("Failed to fetch recurring transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const addRecurringTransaction = async (transactionData) => {
    try {
      const response = await createRecurringTransaction(transactionData);
      setRecurringTransactions([...recurringTransactions, response.data]);
      toast.success("Recurring transaction added successfully");
    } catch (err) {
      toast.error("Failed to add recurring transaction");
    }
  };

  const updateRecurringTransactionById = async (id, transactionData) => {
    try {
      const response = await updateRecurringTransaction(id, transactionData);
      setRecurringTransactions(
        recurringTransactions.map((transaction) =>
          transaction.id === id ? response.data : transaction,
        ),
      );
      toast.success("Recurring transaction updated successfully");
    } catch (err) {
      toast.error("Failed to update recurring transaction");
    }
  };

  const deleteRecurringTransactionById = async (id) => {
    try {
      await deleteRecurringTransaction(id);
      setRecurringTransactions(
        recurringTransactions.filter((transaction) => transaction.id !== id),
      );
      toast.success("Recurring transaction deleted successfully");
    } catch (err) {
      toast.error("Failed to delete recurring transaction");
    }
  };

  return {
    recurringTransactions,
    isLoading,
    error,
    addRecurringTransaction,
    updateRecurringTransaction: updateRecurringTransactionById,
    deleteRecurringTransaction: deleteRecurringTransactionById,
    refreshRecurringTransactions: fetchRecurringTransactions,
  };
}
