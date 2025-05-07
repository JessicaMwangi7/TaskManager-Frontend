import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from "@/components/ui/use-toast";
import { PasswordReset } from "@/components/auth/PasswordReset";
import { MultiFactorAuth } from "@/components/auth/MultiFactorAuth";
import { useSupabaseData } from "@/hooks/use-supabase-data";
import { Loader2, User, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { userData, updateUserData, isPending } = useSupabaseData();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: userData?.notifications?.email || true,
    pushNotifications: userData?.notifications?.push || false,
    budgetAlerts: userData?.notifications?.budget_alerts || true,
    securityAlerts: userData?.notifications?.security_alerts || true,
  });

  const handleUpdateProfile = async () => {
    try {
      await updateUserData({
        full_name: `${firstName} ${lastName}`.trim(),
      });

      // toast({
      //   title: "Profile Updated",
      //   description: "Your profile information has been updated successfully.",
      // });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to update profile. Please try again.",
      //   variant: "destructive",
      // });
    }
  };

  const handleUpdateNotifications = async () => {
    try {
      await updateUserData({
        notifications: notificationSettings,
      });

      // toast({
      //   title: "Notification Settings Updated",
      //   description: "Your notification preferences have been saved.",
      // });
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description:
      //     "Failed to update notification settings. Please try again.",
      //   variant: "destructive",
      // });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we load your settings.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <div className="animate-in fade-in duration-300 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-2 mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={user?.imageUrl}
                          alt={user?.fullName}
                        />
                        <AvatarFallback>
                          {user?.firstName?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed directly. Please contact
                        support.
                      </p>
                    </div>

                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isPending}
                      className="w-full mt-4"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Account ID</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.id}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Account Created</p>
                      <p className="text-sm text-muted-foreground">
                        {userData?.created_at
                          ? new Date(userData.created_at).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Account Status</p>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <p className="text-sm">Active</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Account Type</p>
                      <p className="text-sm text-muted-foreground">
                        {userData?.subscription_tier || "Free"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6 md:grid-cols-2">
              <PasswordReset />
              <MultiFactorAuth />
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">
                      Notification Channels
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications on your device
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            pushNotifications: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Types</h3>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Budget Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when you're approaching budget limits
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.budgetAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            budgetAlerts: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about security-related events
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            securityAlerts: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleUpdateNotifications}
                    disabled={isPending}
                    className="w-full mt-4"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Notification Settings"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
