import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useWallets } from "@/hooks/use-wallets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import apiClient from "@/api/client";

export function SharedWalletForm({ isOpen, onClose, onSuccess }) {
  const { wallets, isLoading: walletsLoading } = useWallets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      permission: "viewer",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const sharedWalletData = {
        wallet_id: parseInt(data.wallet_id),
        member_email: data.member_email,
        permission: data.permission,
      };

      const response = await apiClient.post(
        "/api/shared-wallets",
        sharedWalletData,
      );

      toast.success("Wallet shared successfully!");

      reset();
      onSuccess && onSuccess(response.data);
      onClose && onClose();
    } catch (error) {
      console.error("Error sharing wallet:", error);
      toast.error(error.response?.data?.error || "Failed to share wallet");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Wallet</DialogTitle>
          <DialogDescription>
            Share your wallet with family, friends, or colleagues
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="wallet_id">Select Wallet to Share</Label>
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
              <p className="text-sm text-red-500">{errors.wallet_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="member_email">Email Address</Label>
            <Input
              id="member_email"
              type="email"
              {...register("member_email", {
                required: "Email address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter email address"
            />
            {errors.member_email && (
              <p className="text-sm text-red-500">
                {errors.member_email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission">Permission Level</Label>
            <Controller
              name="permission"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      Viewer (can only view transactions)
                    </SelectItem>
                    <SelectItem value="editor">
                      Editor (can add/edit transactions)
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose && onClose();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sharing...
                </>
              ) : (
                "Share Wallet"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
