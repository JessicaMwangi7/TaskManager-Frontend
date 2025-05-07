import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle, Plus, Edit, Trash } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";

const CategoryManager = () => {
  const { user } = useAuth();
  const {
    categories,
    isLoading,
    createCategory,
    deleteCategory,
    updateCategory,
    isPending,
  } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
    icon: "📝",
    color: "#78909C",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset form
  useEffect(() => {
    if (!showForm) {
      setFormData({
        name: "",
        type: "expense",
        icon: "📝",
        color: "#78909C",
        description: "",
      });
      setEditingCategory(null);
    }
  }, [showForm]);

  // Set form data when editing
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        type: editingCategory.type || "expense",
        icon: editingCategory.icon || "📝",
        color: editingCategory.color || "#78909C",
        description: editingCategory.description || "",
      });
      setShowForm(true);
    }
  }, [editingCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: formData,
        });
        setSuccess("Category updated successfully");
      } else {
        await createCategory(formData);
        setSuccess("Category created successfully");
      }

      // Reset form
      setFormData({
        name: "",
        type: "expense",
        icon: "📝",
        color: "#78909C",
        description: "",
      });
      setEditingCategory(null);

      // Hide form after successful submission
      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to save category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        setSuccess("Category deleted successfully");

        // Clear success message after a delay
        setTimeout(() => {
          setSuccess("");
        }, 2000);
      } catch (err) {
        setError(err.message || "Failed to delete category");
      }
    }
  };

  // Group categories by type
  const expenseCategories = categories.filter((cat) => cat.type === "expense");
  const incomeCategories = categories.filter((cat) => cat.type === "income");

  if (!user) {
    return (
      <div className="text-center py-8">
        Please log in to manage categories.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Manage Categories
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </>
          )}
        </button>
      </div>

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

      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Icon (Emoji)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="block w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Emoji icon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="flex-1 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="block w-full rounded-md shadow-sm border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Category description"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
                className="mr-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Category</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading categories...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">
              Expense Categories
            </h3>
            {expenseCategories.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No expense categories found.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {expenseCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border rounded-md p-3 bg-white dark:bg-gray-700 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{category.icon}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div
                      className="w-full h-1 rounded-full mt-1"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    {category.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">
              Income Categories
            </h3>
            {incomeCategories.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No income categories found.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {incomeCategories.map((category) => (
                  <div
                    key={category.id}
                    className="border rounded-md p-3 bg-white dark:bg-gray-700 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{category.icon}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div
                      className="w-full h-1 rounded-full mt-1"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    {category.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
