import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check, KeyRound } from "lucide-react";
import { updatePasswordWithToken } from "@/api/auth";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export function UpdatePasswordForm() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasResetToken, setHasResetToken] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  // Check if URL contains reset token
  useEffect(() => {
    // !TOD: ADD check for the presence of the reset token in the URL
    // NOW , we'll assume it's present if we're on the reset-password page
    const isResetPasswordPage =
      window.location.pathname.includes("reset-password");
    setHasResetToken(isResetPasswordPage);
  }, []);

  // Check password strength
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[a-z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;

    if (score === 0) {
      feedback = "Password is too weak";
    } else if (score <= 2) {
      feedback = "Password is weak";
    } else if (score <= 3) {
      feedback = "Password is good";
    } else {
      feedback = "Password is strong";
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
      await updatePasswordWithToken(newPassword);
      setIsSuccess(true);
      toast.success("Password updated successfully");

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasResetToken) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertDescription>
              Please request a new password reset link from the login page.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/forgot-password">
            <Button>Request New Reset Link</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <KeyRound className="h-5 w-5" />
          Set New Password
        </CardTitle>
        <CardDescription>
          Create a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription>
              Your password has been updated successfully. You will be
              redirected to the login page.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                required
                disabled={isSubmitting}
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
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                      }}
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
                disabled={isSubmitting}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  Passwords don't match
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
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
        )}
      </CardContent>
    </Card>
  );
}

export default UpdatePasswordForm;
