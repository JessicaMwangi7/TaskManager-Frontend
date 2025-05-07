import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { useWallets } from "@/hooks/use-wallets";
import { useCategories } from "@/hooks/use-categories";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Filter, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Define a global client key to prevent multiple instances
export const SUPABASE_CLIENT_KEY = "TRANSACTIONS_PAGE_CLIENT";

export function TransactionsPage() {
  const [filters, setFilters] = useState({});
  const { transactions, isLoading, createTransaction, isPending } =
    useTransactions(filters, SUPABASE_CLIENT_KEY);
  const { wallets, isLoading: walletsLoading } =
    useWallets(SUPABASE_CLIENT_KEY);
  const { categories, isLoading: categoriesLoading } =
    useCategories(SUPABASE_CLIENT_KEY);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "default",
    },
  });

  const onSubmit = async (data) => {
    try {
      await createTransaction({
        wallet_id: data.wallet_id,
        category_id: data.category_id,
        amount: Number.parseFloat(data.amount),
        type: data.type,
        description: data.description,
        date: date.toISOString(),
        is_recurring: data.is_recurring || false,
        recurring_interval: data.is_recurring ? data.recurring_interval : null,
      });
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  };

  const applyFilter = (filter) => {
    setFilters((prev) => ({ ...prev, ...filter }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const expenseCategories =
    categories?.filter((cat) => cat.type === "expense") || [];
  const incomeCategories =
    categories?.filter((cat) => cat.type === "income") || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            View and manage your transaction history.
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => applyFilter({ type: "income" })}>
                Income Only
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => applyFilter({ type: "expense" })}
              >
                Expenses Only
              </DropdownMenuItem>
              {wallets?.map((wallet) => (
                <DropdownMenuItem
                  key={wallet.id}
                  onClick={() => applyFilter({ wallet_id: wallet.id })}
                >
                  {wallet.name} Only
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={clearFilters}>
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-md"
              aria-describedby="transaction-form-description"
            >
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription id="transaction-form-description">
                  Fill out the form below to add a new transaction to your
                  account.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="wallet_id">Wallet</Label>
                  <Controller
                    name="wallet_id"
                    control={control}
                    rules={{ required: "Wallet is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          {walletsLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading wallets...
                            </SelectItem>
                          ) : wallets?.length === 0 ? (
                            <SelectItem value="none" disabled>
                              No wallets available
                            </SelectItem>
                          ) : (
                            wallets?.map((wallet) => (
                              <SelectItem
                                key={wallet.id}
                                value={wallet.id.toString()}
                              >
                                {wallet.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.wallet_id && (
                    <p className="text-sm text-red-500">
                      {errors.wallet_id.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Transaction type is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <p className="text-sm text-red-500">
                      {errors.type.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Controller
                    name="category_id"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          ) : (
                            <>
                              {/* !Fixed: Replaced empty string with placeholder value */}
                              <SelectItem value="placeholder" disabled>
                                Select a category
                              </SelectItem>
                              {expenseCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                              {incomeCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category_id && (
                    <p className="text-sm text-red-500">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...register("amount", {
                      required: "Amount is required",
                      valueAsNumber: true,
                      min: {
                        value: 0.01,
                        message: "Amount must be greater than 0",
                      },
                    })}
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    placeholder="Grocery shopping"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Transaction"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-[400px] w-full" />
      ) : transactions?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No transactions found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {Object.keys(filters).length > 0
              ? "Try changing your filters or create a new transaction."
              : "Create your first transaction to start tracking your finances."}
          </p>
          <div className="flex gap-2 mt-4">
            {Object.keys(filters).length > 0 && (
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </div>
      ) : (
        <TransactionHistory transactions={transactions} />
      )}
    </div>
  );
}
