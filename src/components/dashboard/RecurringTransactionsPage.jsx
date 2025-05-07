import { useRecurringTransactions } from "@/hooks/use-recurring-transactions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecurringTransactionsPage() {
  const {
    recurringTransactions,
    isLoading,
    error,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
  } = useRecurringTransactions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Recurring Transactions</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recurringTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.amount}</TableCell>
              <TableCell>{transaction.frequency}</TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    updateRecurringTransaction(transaction.id, {
                      /* updated data */
                    })
                  }
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteRecurringTransaction(transaction.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={() =>
          addRecurringTransaction({
            /*<><><> new transaction data<><><> */
          })
        }
      >
        Add Recurring Transaction
      </Button>
    </div>
  );
}
