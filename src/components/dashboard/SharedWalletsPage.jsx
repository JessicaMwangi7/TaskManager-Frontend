import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, Edit, Users, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { SharedWalletForm } from "./SharedWalletForm";
import apiClient from "@/api/client";

export function SharedWalletsPage() {
  const { user } = useAuth();
  const [sharedWallets, setSharedWallets] = useState({
    owned: [],
    shared_with_me: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isShareFormOpen, setIsShareFormOpen] = useState(false);

  useEffect(() => {
    fetchSharedWallets();
  }, []);

  const fetchSharedWallets = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/api/shared-wallets");
      setSharedWallets(response.data);
    } catch (error) {
      console.error("Error fetching shared wallets:", error);
      toast.error("Failed to load shared wallets");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAccess = async (sharedWalletId) => {
    if (
      !window.confirm("Are you sure you want to remove this shared access?")
    ) {
      return;
    }

    try {
      await apiClient.delete(`/api/shared-wallets/${sharedWalletId}`);
      toast.success("Shared access removed successfully");
      fetchSharedWallets();
    } catch (error) {
      console.error("Error removing shared access:", error);
      toast.error("Failed to remove shared access");
    }
  };

  const handleUpdatePermission = async (sharedWalletId, newPermission) => {
    try {
      await apiClient.put(`/api/shared-wallets/${sharedWalletId}`, {
        permission: newPermission,
      });
      toast.success("Permission updated successfully");
      fetchSharedWallets();
    } catch (error) {
      console.error("Error updating permission:", error);
      toast.error("Failed to update permission");
    }
  };

  const getPermissionBadge = (permission) => {
    switch (permission) {
      case "owner":
        return <Badge className="bg-blue-500">Owner</Badge>;
      case "editor":
        return <Badge className="bg-green-500">Editor</Badge>;
      case "viewer":
        return <Badge className="bg-gray-500">Viewer</Badge>;
      default:
        return <Badge>{permission}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shared Wallets</h2>
          <p className="text-muted-foreground">
            Manage wallets shared with others or shared with you
          </p>
        </div>
        <Button onClick={() => setIsShareFormOpen(true)}>
          <Share2 className="mr-2 h-4 w-4" /> Share Wallet
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Wallets I've shared with others */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Wallets I've Shared</h3>
            {sharedWallets.owned.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You haven't shared any wallets yet
                  </p>
                  <Button onClick={() => setIsShareFormOpen(true)}>
                    <Share2 className="mr-2 h-4 w-4" /> Share a Wallet
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {sharedWallets.owned.map((shared) => (
                  <Card key={shared.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{shared.wallet?.name || "Wallet"}</span>
                        {getPermissionBadge("owner")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback>
                            {shared.member?.full_name?.[0] ||
                              shared.member?.email?.[0] ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {shared.member?.full_name || "User"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {shared.member?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Current permission:{" "}
                            {getPermissionBadge(shared.permission)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdatePermission(
                                shared.id,
                                shared.permission === "viewer"
                                  ? "editor"
                                  : "viewer",
                              )
                            }
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            {shared.permission === "viewer"
                              ? "Make Editor"
                              : "Make Viewer"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAccess(shared.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Wallets shared with me */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Shared With Me</h3>
            {sharedWallets.shared_with_me.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground">
                    No wallets have been shared with you yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {sharedWallets.shared_with_me.map((shared) => (
                  <Card key={shared.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{shared.wallet?.name || "Wallet"}</span>
                        {getPermissionBadge(shared.permission)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar>
                          <AvatarFallback>
                            {shared.owner?.full_name?.[0] ||
                              shared.owner?.email?.[0] ||
                              "O"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {shared.owner?.full_name || "Owner"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {shared.owner?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">
                            Balance: {shared.wallet?.currency}{" "}
                            {Number(shared.wallet?.balance).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAccess(shared.id)}
                        >
                          Leave
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <SharedWalletForm
        isOpen={isShareFormOpen}
        onClose={() => setIsShareFormOpen(false)}
        onSuccess={() => {
          fetchSharedWallets();
        }}
      />
    </div>
  );
}
