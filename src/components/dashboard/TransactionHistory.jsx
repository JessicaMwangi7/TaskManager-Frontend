import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useCategories } from "@/hooks/use-categories";
import { useWallets } from "@/hooks/use-wallets";

export function TransactionHistory({ transactions }) {
  const { categories } = useCategories();
  const { wallets } = useWallets();

  const getCategoryName = (categoryId) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || "Uncategorized";
  };

  const getWalletName = (walletId) => {
    const wallet = wallets?.find((w) => w.id === walletId);
    return wallet?.name || "Unknown Wallet";
  };

  const getCurrency = (walletId) => {
    const wallet = wallets?.find((w) => w.id === walletId);
    return wallet?.currency || "KES";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  {getCategoryName(transaction.category_id)}
                </TableCell>
                <TableCell>{getWalletName(transaction.wallet_id)}</TableCell>
                <TableCell
                  className={cn("text-right", {
                    "text-green-600": transaction.type === "income",
                    "text-red-600": transaction.type === "expense",
                  })}
                >
                  {transaction.type === "income" ? "+" : "-"}{" "}
                  {getCurrency(transaction.wallet_id)}{" "}
                  {Math.abs(
                    Number.parseFloat(transaction.amount),
                  ).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
