import { useState } from "react";
import { useBudgets } from "@/hooks/use-budgets";
import { useWallets } from "@/hooks/use-wallets";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Edit, CalendarIcon, Loader2 } from "lucide-react";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-toastify";

export function BudgetsPage() {
  const {
    budgets,
    isLoading,
    createBudget,
    updateBudget,
    deleteBudget,
    isPending,
  } = useBudgets();
  const { wallets, isLoading: walletsLoading } = useWallets();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [open, setOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const budgetData = {
        category_id: parseInt(data.category_id),
        wallet_id: parseInt(data.wallet_id),
        amount: Number.parseFloat(data.amount),
        period: data.period,
        start_date: startDate.toISOString(),
        end_date: endDate ? endDate.toISOString() : null,
      };

      if (editingBudget) {
        await updateBudget({ id: editingBudget.id, data: budgetData });
        toast.success("Budget updated successfully!");
      } else {
        await createBudget(budgetData);
        toast.success("Budget created successfully!");
      }

      setOpen(false);
      setEditingBudget(null);
      reset();
      setStartDate(new Date());
      setEndDate(null);
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error(error.response?.data?.error || "Failed to save budget");
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setValue("category_id", budget.category_id.toString());
    setValue("wallet_id", budget.wallet_id.toString());
    setValue("amount", budget.amount);
    setValue("period", budget.period);
    setStartDate(new Date(budget.start_date));
    setEndDate(budget.end_date ? new Date(budget.end_date) : null);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await deleteBudget(id);
        toast.success("Budget deleted successfully!");
      } catch (error) {
        console.error("Error deleting budget:", error);
        toast.error(error.response?.data?.error || "Failed to delete budget");
      }
    }
  };

  const expenseCategories =
    categories?.filter((cat) => cat.type === "expense") || [];

  // budget progress based on actual spending data
  const calculateProgress = (budget) => {
    //!TODO ()-> fetch actual spending for this budget
    // now, we'll simulate it with a more realistic calculation

    // current date for calculations
    const now = new Date();
    const start = new Date(budget.start_date);
    const end = budget.end_date ? new Date(budget.end_date) : null;

    // Calculate time progress (how far we are into the budget period)
    let timeProgress = 0;

    if (end) {
      // If there's an end date, calculate based on start-end interval
      const totalDuration = end - start;
      const elapsedDuration = Math.min(now - start, totalDuration);
      timeProgress = Math.max(
        0,
        Math.min(100, (elapsedDuration / totalDuration) * 100),
      );
    } else {
      // For recurring budgets without end date, calculate based on period
      const dayOfMonth = now.getDate();
      switch (budget.period) {
        case "daily":
          // For daily budget, use hours passed
          const hoursInDay = 24;
          const hoursPassed = now.getHours() + now.getMinutes() / 60;
          timeProgress = (hoursPassed / hoursInDay) * 100;
          break;
        case "weekly":
          // For weekly, use days of week (0-6)
          const daysInWeek = 7;
          const dayOfWeek = now.getDay();
          timeProgress = (dayOfWeek / daysInWeek) * 100;
          break;
        case "monthly":
          // For monthly, use days in month
          const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
          ).getDate();
          timeProgress = (dayOfMonth / daysInMonth) * 100;
          break;
        case "quarterly":
          // For quarterly, use month in quarter (0-2)
          const monthsInQuarter = 3;
          const monthOfQuarter = now.getMonth() % 3;
          const daysInCurrentMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
          ).getDate();
          timeProgress =
            ((monthOfQuarter * daysInCurrentMonth + dayOfMonth) /
              (monthsInQuarter * 30)) *
            100;
          break;
        case "yearly":
          // For yearly, use day of year
          const dayOfYear = Math.floor(
            (now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24),
          );
          const daysInYear = now.getFullYear() % 4 === 0 ? 366 : 365;
          timeProgress = (dayOfYear / daysInYear) * 100;
          break;
        default:
          timeProgress = 50; // Default fallback
      }
    }

    // Simulated spending progress (slightly random but weighted by time progress)
    // TODO calculatION: (actual spending / budget amount) * 100
    const randomFactor = 0.8 + Math.random() * 0.4;
    const spendingProgress = Math.min(100, timeProgress * randomFactor);

    return Math.floor(spendingProgress);
  };

  // Calculate remaining budget amount
  const calculateRemaining = (budget, progress) => {
    return budget.amount - (budget.amount * progress) / 100;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">
            Set and track your spending limits.
          </p>
        </div>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setEditingBudget(null);
              reset();
              setStartDate(new Date());
              setEndDate(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? "Edit Budget" : "Create New Budget"}
              </DialogTitle>
              <DialogDescription>
                {editingBudget
                  ? "Update your budget settings"
                  : "Set a budget to help manage your spending"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                        ) : expenseCategories.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No expense categories available
                          </SelectItem>
                        ) : (
                          expenseCategories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))
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
                <Label htmlFor="amount">Budget Amount</Label>
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
                <Label htmlFor="period">Budget Period</Label>
                <Controller
                  name="period"
                  control={control}
                  rules={{ required: "Period is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.period && (
                  <p className="text-sm text-red-500">
                    {errors.period.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => date < startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setEditingBudget(null);
                    reset();
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingBudget ? "Updating..." : "Creating..."}
                    </>
                  ) : editingBudget ? (
                    "Update Budget"
                  ) : (
                    "Create Budget"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[180px] w-full" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No budgets found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first budget to start managing your spending.
          </p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Budget
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const progress = calculateProgress(budget);
            const remaining = calculateRemaining(budget, progress);
            const wallet = wallets?.find((w) => w.id === budget.wallet_id);
            const category = categories?.find(
              (c) => c.id === budget.category_id,
            );

            // Determine color based on progress
            const getProgressColor = (value) => {
              if (value < 70) return "bg-green-500";
              if (value < 90) return "bg-yellow-500";
              return "bg-red-500";
            };

            return (
              <Card key={budget.id} className="overflow-hidden">
                {/* <div
                  className={`h-1 ${getProgressColor(progress)}`}
                  style={{ width: `${progress}%` }}
                ></div> */}
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between">
                    <span>{category?.name || "Budget"}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {budget.period}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {wallet?.name || "Wallet"} •{" "}
                    {format(new Date(budget.start_date), "MMM d, yyyy")}
                    {budget.end_date &&
                      ` - ${format(new Date(budget.end_date), "MMM d, yyyy")}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-2xl font-bold">
                      {wallet?.currency || "KES"}{" "}
                      {Number.parseFloat(budget.amount).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Remaining: {wallet?.currency || "KES"}{" "}
                      {remaining.toFixed(2)}
                    </div>
                  </div>
                  <Progress
                    value={progress}
                    className={`h-2 `}
                    indicatorClassName={getProgressColor(progress)}
                  />
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <span>{progress}% used</span>
                    <span>{100 - progress}% left</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(budget)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(budget.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
