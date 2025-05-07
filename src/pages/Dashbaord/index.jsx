import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { WalletsPage } from "@/components/dashboard/WalletsPage";
import { TransactionsPage } from "@/components/dashboard/TransactionsPage";
import { BudgetsPage } from "@/components/dashboard/BudgetsPage";
import { NotificationsPage } from "@/components/dashboard/NotificationsPage";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallets } from "@/hooks/use-wallets";
import { useTransactions } from "@/hooks/use-transactions";
import { useBudgets } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import SettingsPage from "@/components/dashboard/Settings";
import { ReportsPage } from "@/components/dashboard/ReportsPage";
import { SharedWalletsPage } from "@/components/dashboard/SharedWalletsPage";
import { RecurringTransactionsPage } from "@/components/dashboard/RecurringTransactionsPage";

const DashboardOverview = ({ user }) => {
  const { wallets, isLoading: walletsLoading } = useWallets();
  const { transactions, isLoading: transactionsLoading } = useTransactions({
    limit: 5,
  });
  const { budgets, isLoading: budgetsLoading } = useBudgets();
  const { categories } = useCategories();
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    netFlow: 0,
  });

  // Calculate financial statistics
  useEffect(() => {
    if (!wallets || !transactions) return;

    const totalBalance = wallets.reduce(
      (sum, wallet) => sum + Number(wallet.balance),
      0,
    );

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = transactions.filter(
      (t) => new Date(t.date) >= startOfMonth,
    );

    const totalIncome = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setStats({
      totalBalance,
      totalIncome,
      totalExpense,
      netFlow: totalIncome - totalExpense,
    });
  }, [wallets, transactions]);

  // Prepare data for charts - memoize to prevent recalculations
  const chartData = useMemo(() => {
    if (!transactions || !categories) return { income: [], expense: [] };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = transactions.filter(
      (t) => new Date(t.date) >= startOfMonth,
    );

    // Group by category
    const expenseByCategory = {};
    const incomeByCategory = {};

    monthlyTransactions.forEach((transaction) => {
      const categoryId = transaction.category_id;
      const category = categories.find((c) => c.id === categoryId);
      const categoryName = category ? category.name : "Uncategorized";

      if (transaction.type === "expense") {
        expenseByCategory[categoryName] =
          (expenseByCategory[categoryName] || 0) + Number(transaction.amount);
      } else {
        incomeByCategory[categoryName] =
          (incomeByCategory[categoryName] || 0) + Number(transaction.amount);
      }
    });

    return {
      expense: Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
      })),
      income: Object.entries(incomeByCategory).map(([name, value]) => ({
        name,
        value,
      })),
    };
  }, [transactions, categories]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Hello, {user?.firstName || "User"}!
        </h2>
        <p className="text-muted-foreground">
          Here's an overview of your finances for{" "}
          {format(new Date(), "MMMM yyyy")}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {walletsLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => <Skeleton key={i} className="h-[120px] w-full" />)
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KES {stats.totalBalance.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {wallets.length} wallet
                  {wallets.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Income
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  KES {stats.totalIncome.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  For {format(new Date(), "MMMM yyyy")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Expenses
                </CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  KES {stats.totalExpense.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  For {format(new Date(), "MMMM yyyy")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Cash Flow
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${stats.netFlow >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  KES {stats.netFlow.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.netFlow >= 0 ? "Positive" : "Negative"} cash flow
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Wallets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Your Wallets</h3>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/wallets">View All</a>
          </Button>
        </div>

        {walletsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[180px] w-full" />
              ))}
          </div>
        ) : wallets?.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No wallets found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first wallet to start tracking your finances.
            </p>
            <Button asChild>
              <a href="/dashboard/wallets">
                <Plus className="mr-2 h-4 w-4" /> Add Wallet
              </a>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wallets.slice(0, 3).map((wallet) => (
              <WalletCard
                key={wallet.id}
                title={wallet.name}
                balance={wallet.balance}
                currency={wallet.currency}
                cardNumber={wallet.id.toString().padStart(4, "0")}
                description={wallet.description}
                type={wallet.type}
              />
            ))}
          </div>
        )}
      </div>

      {/* Financial Charts */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="expense">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            {transactionsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : chartData.expense.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <FinancialChart data={chartData.expense} type="expense" />
                </CardContent>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No expense data available for this period.
                </p>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="income">
            {transactionsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : chartData.income.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <FinancialChart data={chartData.income} type="income" />
                </CardContent>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No income data available for this period.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/transactions">View All</a>
          </Button>
        </div>

        {transactionsLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : transactions?.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No transactions found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first transaction to start tracking your finances.
            </p>
            <Button asChild>
              <a href="/dashboard/transactions">
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </a>
            </Button>
          </Card>
        ) : (
          <TransactionHistory transactions={transactions.slice(0, 5)} />
        )}
      </div>
    </div>
  );
};

export default function Dashboard({ activePage = "overview" }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate page transition loading
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activePage]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the appropriate content based on the active page
  const renderContent = () => {
    if (isPageLoading) {
      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
          </div>
        </div>
      );
    }

    switch (activePage) {
      case "wallets":
        return <WalletsPage />;
      case "transactions":
        return <TransactionsPage />;
      case "budgets":
        return <BudgetsPage />;
      case "reports":
        return <ReportsPage />;
      case "recurring":
        return <RecurringTransactionsPage />;
      case "notifications":
        return <NotificationsPage />;
      case "shared":
        return <SharedWalletsPage />;
      case "settings":
        return <SettingsPage />;
      case "overview":
      default:
        return <DashboardOverview user={user} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-in fade-in duration-300">{renderContent()}</div>
    </DashboardLayout>
  );
}
