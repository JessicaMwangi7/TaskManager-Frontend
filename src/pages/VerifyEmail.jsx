import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      toast.error("Authentication system is loading. Please try again.");
      return;
    }

    try {
      setIsLoading(true);

      // Attempt to verify the email address
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        // Set the user as active
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("Email verified successfully!");

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        console.log("Verification status:", completeSignUp);
        toast.error("Verification incomplete. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error.errors?.[0]?.message || "Verification failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      toast.info("Verification code resent. Please check your email.");
    } catch (error) {
      console.error("Error resending code:", error);
      toast.error("Failed to resend verification code.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground mt-2">
            We've sent a verification code to your email address. Please enter
            it below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="code"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="link" onClick={handleResendCode}>
            Didn't receive a code? Resend
          </Button>
        </div>
      </div>
    </div>
  );
}
