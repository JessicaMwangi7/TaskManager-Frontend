import { useState, useEffect } from "react";
import {
  getSharedWallets,
  shareWallet,
  updateSharedWallet,
  removeSharedWallet,
} from "@/api/client";
import { toast } from "react-toastify";

export function useSharedWallets() {
  const [sharedWallets, setSharedWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedWallets();
  }, []);

  const fetchSharedWallets = async () => {
    setIsLoading(true);
    try {
      const response = await getSharedWallets();
      setSharedWallets(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch shared wallets");
      toast.error("Failed to fetch shared wallets");
    } finally {
      setIsLoading(false);
    }
  };

  const shareNewWallet = async (walletData) => {
    try {
      const response = await shareWallet(walletData);
      setSharedWallets([...sharedWallets, response.data]);
      toast.success("Wallet shared successfully");
    } catch (err) {
      toast.error("Failed to share wallet");
    }
  };

  const updateSharedWalletById = async (id, walletData) => {
    try {
      const response = await updateSharedWallet(id, walletData);
      setSharedWallets(
        sharedWallets.map((wallet) =>
          wallet.id === id ? response.data : wallet,
        ),
      );
      toast.success("Shared wallet updated successfully");
    } catch (err) {
      toast.error("Failed to update shared wallet");
    }
  };

  const removeSharedWalletById = async (id) => {
    try {
      await removeSharedWallet(id);
      setSharedWallets(sharedWallets.filter((wallet) => wallet.id !== id));
      toast.success("Shared wallet removed successfully");
    } catch (err) {
      toast.error("Failed to remove shared wallet");
    }
  };

  return {
    sharedWallets,
    isLoading,
    error,
    shareWallet: shareNewWallet,
    updateSharedWallet: updateSharedWalletById,
    removeSharedWallet: removeSharedWalletById,
    refreshSharedWallets: fetchSharedWallets,
  };
}
