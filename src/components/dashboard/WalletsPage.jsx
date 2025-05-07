import { useState } from "react";
import { useWallets } from "@/hooks/use-wallets";
import { WalletCard } from "@/components/dashboard/WalletCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WalletsPage() {
  const {
    wallets,
    isLoading,
    createWallet,
    isPending,
    syncWithSupabase,
    isSyncing,
  } = useWallets();

  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await createWallet({
      name: data.name,
      description: data.description || "",
      currency: data.currency || "KES",
      balance: Number.parseFloat(data.balance || 0),
      type: data.type || "personal",
    });
    setOpen(false);
    reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallets</h2>
          <p className="text-muted-foreground">
            Manage your wallets and payment methods.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => syncWithSupabase()}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Sync
              </>
            )}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Wallet</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Wallet Name</Label>
                  <Input
                    id="name"
                    {...register("name", {
                      required: "Wallet name is required",
                    })}
                    placeholder="Main Wallet"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    {...register("description")}
                    placeholder="My primary spending account"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="balance">Initial Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    {...register("balance", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                  />
                  {errors.balance && (
                    <p className="text-sm text-red-500">
                      {errors.balance.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select name="currency" defaultValue="KES">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KES">KES</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Wallet Type</Label>
                    <Select name="type" defaultValue="personal">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    {isPending ? "Creating..." : "Create Wallet"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[180px] w-full" />
          ))}
        </div>
      ) : wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No wallets found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first wallet to start tracking your finances.
          </p>
          <Button className="mt-4" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Wallet
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
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
  );
}
