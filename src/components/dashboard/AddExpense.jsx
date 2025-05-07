import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { useWallets } from "@/hooks/use-wallets";
import { useTransactions } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";

const ExpenseIncomeForm = () => {
  const { user } = useAuth();
  const { wallets, isLoading: isLoadingWallets } = useWallets();
  const { createTransaction, isPending } = useTransactions();
  const { categories: apiCategories, isLoading: isLoadingCategories } =
    useCategories();

  // Default date to current date
  const today = new Date().toISOString().substr(0, 10);

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category_id: "",
    date: today,
    description: "",
    wallet_id: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // If only one wallet is available, select it by default
  useEffect(() => {
    if (wallets?.length === 1 && !formData.wallet_id) {
      setFormData((prev) => ({
        ...prev,
        wallet_id: wallets[0].id,
      }));
    }
  }, [wallets, formData.wallet_id]);

  // Filter categories based on transaction type
  const categories =
    apiCategories?.filter((cat) => cat.type === formData.type) || [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear status messages
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.wallet_id) {
      setError("Please select a wallet");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category");
      return;
    }

    // Convert amount to number and ensure it's positive(JAVASCRIPT DISADVANTAGE)
    const amount = Number.parseFloat(formData.amount);

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than zero");
      return;
    }

    try {
      // transaction data
      const transactionData = {
        type: formData.type,
        amount: amount,
        wallet_id: Number.parseInt(formData.wallet_id),
        category_id: Number.parseInt(formData.category_id),
        date: new Date(formData.date).toISOString(),
        description: formData.description || `${formData.type} transaction`,
      };

      console.log("Submitting transaction:", transactionData);

      // Submit transaction
      await createTransaction(transactionData);

      // Reset
      setFormData({
        ...formData,
        amount: "",
        description: "",
        category_id: "",
        date: today,
      });

      setSuccess(
        `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} added successfully!`,
      );
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  // wallet details by ID
  const getWallet = (id) => {
    return wallets?.find((w) => w.id.toString() === id.toString());
  };

  // category by ID
  const getCategory = (id) => {
    return categories.find((c) => c.id.toString() === id.toString());
  };

  if (!user) {
    return (
      <div className="text-center py-8">Please log in to add transactions.</div>
    );
  }

  // If no categories are available, show a message
  if (!isLoadingCategories && categories.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-center py-4">
          <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            No Categories Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You need to create categories before adding transactions.
          </p>
          <a
            href="/categories"
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Manage Categories
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Add {formData.type === "expense" ? "Expense" : "Income"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center text-red-800 dark:text-red-300">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Toggle */}
        <div className="flex border rounded-md overflow-hidden">
          <button
            type="button"
            className={`flex-1 py-2 text-center transition-colors ${
              formData.type === "expense"
                ? "bg-red-500 text-white font-medium"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() =>
              setFormData({ ...formData, type: "expense", category_id: "" })
            }
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-center transition-colors ${
              formData.type === "income"
                ? "bg-green-500 text-white font-medium"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            onClick={() =>
              setFormData({ ...formData, type: "income", category_id: "" })
            }
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none gap-1">
              <span className="text-gray-500 dark:text-gray-400">Ksh</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="pl-11 block w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        {/* Wallet Selec */}
        <div>
          <label
            htmlFor="wallet_id"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Select Wallet
          </label>
          {isLoadingWallets ? (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
            </div>
          ) : wallets?.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {wallets.map((wallet) => {
                // Dynamically determine wallet color class
                const colorMap = {
                  blue: "blue-500",
                  purple: "purple-500",
                  teal: "teal-500",
                  orange: "orange-500",
                  red: "red-500",
                  green: "green-500",
                  indigo: "indigo-500",
                  gray: "gray-500",
                };

                const colorClass = colorMap[wallet.color] || "blue-500";
                const bgColorClass =
                  formData.wallet_id === wallet.id.toString()
                    ? `bg-${colorClass.replace("-500", "-50")}`
                    : "";

                return (
                  <div
                    key={wallet.id}
                    className={`border rounded-md p-3 cursor-pointer transition-all ${
                      formData.wallet_id === wallet.id.toString()
                        ? `border-2 border-${colorClass} ${bgColorClass}`
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        wallet_id: wallet.id.toString(),
                      })
                    }
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full bg-${colorClass} mr-2`}
                      ></div>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {wallet.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Balance: ${wallet.balance.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-2 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
              No wallets available
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Category
            </label>
            <a
              href="/categories"
              className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
            >
              <Plus className="w-3 h-3 mr-1" />
              Manage Categories
            </a>
          </div>

          {isLoadingCategories ? (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`border rounded-md p-2 cursor-pointer transition-all flex flex-col items-center ${
                    formData.category_id === category.id.toString()
                      ? `border-2 bg-opacity-10`
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  style={{
                    backgroundColor:
                      formData.category_id === category.id.toString()
                        ? `${category.color}15`
                        : "",
                    borderColor:
                      formData.category_id === category.id.toString()
                        ? category.color
                        : "",
                  }}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      category_id: category.id.toString(),
                    })
                  }
                >
                  <div className="text-xl mb-1">{category.icon}</div>
                  <span className="text-xs font-medium text-center text-gray-800 dark:text-gray-200">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="block w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="block w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={`Enter details about this ${formData.type}...`}
          ></textarea>
        </div>

        {/* Transaction Preview */}
        {formData.amount && formData.wallet_id && formData.category_id && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction Preview
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <span
                className={
                  formData.type === "expense"
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                KES {Number.parseFloat(formData.amount).toFixed(2)}
              </span>
            </div>
            {formData.wallet_id && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Wallet:
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {getWallet(formData.wallet_id)?.name || "Unknown wallet"}
                </span>
              </div>
            )}
            {formData.category_id && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Category:
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {getCategory(formData.category_id)?.icon}{" "}
                  {getCategory(formData.category_id)?.name ||
                    "Unknown category"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
            isPending
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : formData.type === "expense"
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          } flex justify-center items-center`}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Add{" "}
              {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExpenseIncomeForm;
