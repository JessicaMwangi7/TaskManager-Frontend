import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/api/services";
import { toast } from "react-toastify";
import { useAuth } from "./useAuth";

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // all notifications
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getAll,
    enabled: !!user?.id,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Failed to mark notification as read",
      );
    },
  });

  // Mark all notifications as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error ||
          "Failed to mark all notifications as read",
      );
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => {
      toast.success("Notification deleted");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error || "Failed to delete notification",
      );
    },
  });

  // Get unread notifications count
  const unreadCount =
    notificationsQuery.data?.filter((n) => !n.is_read).length || 0;

  return {
    notifications: notificationsQuery.data || [],
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    isPending:
      markAsReadMutation.isPending ||
      markAllAsReadMutation.isPending ||
      deleteNotificationMutation.isPending,
  };
}
