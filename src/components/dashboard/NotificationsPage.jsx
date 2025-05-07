import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Trash2, Bell } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

export function NotificationsPage() {
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isPending,
  } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case "budget_alert":
        return <Bell className="h-5 w-5 text-yellow-500" />;
      case "shared_wallet_invite":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "security_alert":
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with important alerts and messages.
          </p>
        </div>
        {notifications.length > 0 && (
          <Button onClick={markAllAsRead} disabled={isPending}>
            Mark All as Read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No notifications</h3>
          <p className="text-sm text-muted-foreground mt-2">
            You're all caught up! We'll notify you when there's something new.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.is_read ? "opacity-70" : ""}
            >
              <CardHeader className="pb-2 flex flex-row items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {notification.title}
                  </CardTitle>
                  <CardDescription>
                    {format(
                      new Date(notification.created_at),
                      "MMM d, yyyy 'at' h:mm a",
                    )}
                  </CardDescription>
                </div>
                {!notification.is_read && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {!notification.is_read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                    disabled={isPending}
                  >
                    <Check className="mr-2 h-4 w-4" /> Mark as Read
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteNotification(notification.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
