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
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/api/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export function PasswordResetForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      console.error("Error requesting password reset:", error);
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you instructions to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              We've sent password reset instructions to <strong>{email}</strong>
              . Please check your email and follow the link to reset your
              password.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !email}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Link
          to="/login"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}

export default PasswordResetForm;
