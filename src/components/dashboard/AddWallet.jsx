import { useState } from "react";

const AddWalletForm = () => {
  const [walletData, setWalletData] = useState({
    name: "",
    description: "",
    currency: "KES",
    balance: "",
    type: "personal",
    owner_id: "", //  pre-filled with the current user's ID
  });

  // List of common currencies
  const currencies = [
    { code: "KES", name: "Kenyan Shilling" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CNY", name: "Chinese Yuan" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWalletData({
      ...walletData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate a unique ID ->TODO: Should be done be database
    const newWallet = {
      ...walletData,
      id: `wallet_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    console.log("New wallet created:", newWallet);
    alert(`Wallet "${newWallet.name}" created successfully!`);

    // Reset form
    setWalletData({
      name: "",
      description: "",
      currency: "KES",
      balance: "",
      type: "personal",
      owner_id: walletData.owner_id, //owner_id
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Wallet
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Wallet Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Wallet Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={walletData.name}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Personal Expenses, Family Budget"
            required
          />
        </div>

        {/* Wallet Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wallet Type*
          </label>
          <div className="flex border rounded-md overflow-hidden">
            <button
              type="button"
              className={`flex-1 py-2 text-center transition-colors ${
                walletData.type === "personal"
                  ? "bg-blue-500 text-white font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setWalletData({ ...walletData, type: "personal" })}
            >
              Personal
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center transition-colors ${
                walletData.type === "shared"
                  ? "bg-purple-500 text-white font-medium"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setWalletData({ ...walletData, type: "shared" })}
            >
              Shared
            </button>
          </div>
        </div>

        {/* Currency */}
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Currency*
          </label>
          <select
            id="currency"
            name="currency"
            value={walletData.currency}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
            required
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Initial Balance */}
        <div>
          <label
            htmlFor="balance"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Initial Balance*
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">
                {walletData.currency === "KES"
                  ? "KSh"
                  : walletData.currency === "USD"
                    ? "$"
                    : walletData.currency === "EUR"
                      ? "€"
                      : walletData.currency === "GBP"
                        ? "£"
                        : walletData.currency === "JPY"
                          ? "¥"
                          : walletData.currency === "CNY"
                            ? "¥"
                            : ""}
              </span>
            </div>
            <input
              type="number"
              id="balance"
              name="balance"
              value={walletData.balance}
              onChange={handleChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={walletData.description}
            onChange={handleChange}
            rows="3"
            className="block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe the purpose of this wallet..."
          ></textarea>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md bg-black-600 text-white font-medium hover:bg-black-700 transition-colors ${
            walletData.type === "shared"
              ? "bg-purple-600 hover:bg-purple-700"
              : ""
          }`}
        >
          Create Wallet
        </button>
      </form>
    </div>
  );
};

export default AddWalletForm;
