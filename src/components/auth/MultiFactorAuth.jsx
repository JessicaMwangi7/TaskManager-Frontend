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
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldCheck, Smartphone, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { createSupabaseClient } from "@/api/auth";
import { toast } from "react-toastify";

export function MultiFactorAuth() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mfaMethod, setMfaMethod] = useState("email"); // email or phone

  // ()->if MFA is already enabled
  useEffect(() => {
    const checkMfaStatus = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const supabase = await createSupabaseClient();

        const { data, error } = await supabase
          .from("user_data")
          .select("data")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        // if MFA is enabled in user data
        const mfaEnabled = data?.data?.mfa_enabled || false;
        const savedMfaMethod = data?.data?.mfa_method || "email";
        const savedPhone = data?.data?.phone_number || "";

        setIsMfaEnabled(mfaEnabled);
        setMfaMethod(savedMfaMethod);
        setPhoneNumber(savedPhone);
      } catch (error) {
        console.error("Error checking MFA status:", error);
        toast.error("Failed to check MFA status");
      } finally {
        setIsLoading(false);
      }
    };

    checkMfaStatus();
  }, [user?.id]);

  // Enable MFA
  const enableMfa = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Validate phone number if using SMS
      if (mfaMethod === "phone" && !phoneNumber) {
        toast.error("Please enter a valid phone number");
        return;
      }

      // Send verification code
      // !TODO: add twilio or supabase later backend
      // to send a verification code via email or SMS
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        `Verification code sent to your ${mfaMethod === "email" ? "email" : "phone"}`,
      );
      setIsVerifying(true);
    } catch (error) {
      console.error("Error enabling MFA:", error);
      toast.error("Failed to enable MFA");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code and complete MFA setup
  const verifyAndEnableMfa = async () => {
    if (!user?.id || !verificationCode) return;

    try {
      setIsLoading(true);

      // his would verify the code with your backend
      // For demo purposes, we'll accept any 6-digit code
      if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
        toast.error("Please enter a valid 6-digit code");
        return;
      }

      const supabase = await createSupabaseClient();

      // existing user data
      const { data: existingData, error: fetchError } = await supabase
        .from("user_data")
        .select("data")
        .eq("user_id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      // Update user data with MFA settings
      const userData = {
        ...(existingData?.data || {}),
        mfa_enabled: true,
        mfa_method: mfaMethod,
        phone_number: mfaMethod === "phone" ? phoneNumber : undefined,
        mfa_updated_at: new Date().toISOString(),
      };

      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from("user_data")
          .update({ data: userData })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase.from("user_data").insert({
          user_id: user.id,
          email: user.email,
          data: userData,
        });

        if (error) throw error;
      }

      setIsMfaEnabled(true);
      setIsVerifying(false);
      toast.success("Multi-factor authentication enabled successfully");
    } catch (error) {
      console.error("Error verifying MFA code:", error);
      toast.error("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  // Disable MFA
  const disableMfa = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      const supabase = await createSupabaseClient();

      // Get existing user data
      const { data: existingData, error: fetchError } = await supabase
        .from("user_data")
        .select("data")
        .eq("user_id", user.id)
        .single();

      if (fetchError) throw fetchError;

      // Update user data to disable MFA
      const userData = {
        ...existingData.data,
        mfa_enabled: false,
        mfa_updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("user_data")
        .update({ data: userData })
        .eq("user_id", user.id);

      if (error) throw error;

      setIsMfaEnabled(false);
      toast.success("Multi-factor authentication disabled");
    } catch (error) {
      console.error("Error disabling MFA:", error);
      toast.error("Failed to disable MFA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Multi-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isVerifying ? (
          <div className="space-y-4">
            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription>
                A verification code has been sent to your{" "}
                {mfaMethod === "email" ? "email" : "phone"}. Enter the code
                below to enable multi-factor authentication.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={verifyAndEnableMfa}
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Enable"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsVerifying(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : isMfaEnabled ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Multi-factor authentication is enabled using your{" "}
                {mfaMethod === "email" ? "email" : "phone"}.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Current MFA Method</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md">
                {mfaMethod === "email" ? (
                  <>
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span>Email ({user?.email})</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 text-blue-500" />
                    <span>Phone ({phoneNumber})</span>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="destructive"
              onClick={disableMfa}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disabling...
                </>
              ) : (
                "Disable MFA"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mfa-method">Authentication Method</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={mfaMethod === "email" ? "default" : "outline"}
                  className="flex items-center justify-center gap-2"
                  onClick={() => setMfaMethod("email")}
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={mfaMethod === "phone" ? "default" : "outline"}
                  className="flex items-center justify-center gap-2"
                  onClick={() => setMfaMethod("phone")}
                >
                  <Smartphone className="h-4 w-4" />
                  Phone
                </Button>
              </div>
            </div>

            {mfaMethod === "phone" && (
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your phone number with country code
                </p>
              </div>
            )}

            <Button
              onClick={enableMfa}
              disabled={isLoading || (mfaMethod === "phone" && !phoneNumber)}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Enable MFA"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MultiFactorAuth;
