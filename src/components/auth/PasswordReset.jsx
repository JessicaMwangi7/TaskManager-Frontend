import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, KeyRound, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createSupabaseClient } from "@/api/auth";
import { toast } from "react-toastify";

export function PasswordReset() {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  // Check password strength
  const checkPasswordStrength = (password) => {
    // !TODO()-> use a library like zxcvbn
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;

    if (score === 0) {
      feedback = "Password is too weak";
    } else if (score <= 2) {
      feedback = "Password is weak";
    } else if (score <= 4) {
      feedback = "Password is strong";
    } else {
      feedback = "Password is very strong";
    }

    return { score, feedback };
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please choose a stronger password");
      return;
    }

    setIsSubmitting(true);

    try {
      // call an API to change the password
      const supabase = await createSupabaseClient();

      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        setIsSubmitting(false);
        return;
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setIsSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password updated successfully");

      // Reset success state after a delay
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={isSubmitting || isSuccess}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              required
              disabled={isSubmitting || isSuccess}
            />
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Password strength:</span>
                  <span className="text-sm font-medium">
                    {passwordStrength.feedback}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.score <= 2
                        ? "bg-red-500"
                        : passwordStrength.score <= 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting || isSuccess}
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-500 mt-1">Passwords don't match</p>
            )}
          </div>

          {isSuccess && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Your password has been updated successfully.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isSuccess}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default PasswordReset;
