import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSignUp } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import RegistrationPhoto from "../assets/photos/Registration.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import useAuthStore from "../store/useAuthStore";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountType, setAccountType] = useState("personal");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signUp } = useSignUp();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoaded) {
      toast.error("Authentication system is loading. Please try again.");
      return;
    }

    if (!agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    try {
      setIsLoading(true);

      // sign-up process with Clerk
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });

      // After sign up is created, attempt to sign in
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Navigate to the verification page
      navigate("/verify-email");
      toast.info("Please check your email for a verification code.");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err.errors?.[0]?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = (strategy) => {
    if (!isLoaded) {
      return;
    }

    try {
      signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("OAuth sign up error:", error);
      toast.error("Failed to initiate OAuth sign up. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-1">First Time?</h1>
            <p className="text-gray-600 text-sm">Register to get started :)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <Input
                type="text"
                placeholder="Enter your first name"
                className="h-10 px-3 border border-gray-200 rounded-md mt-1"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <Input
                type="text"
                placeholder="Enter your last name"
                className="h-10 px-3 border border-gray-200 rounded-md mt-1"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-10 px-3 border border-gray-200 rounded-md mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="h-10 px-3 border border-gray-200 rounded-md mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Type of Account
              </label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="h-10 px-3 border border-gray-200 rounded-md mt-1">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-row items-start space-x-2 space-y-0 pt-2">
              <Checkbox
                checked={agreeToTerms}
                onCheckedChange={setAgreeToTerms}
                className="mt-1 border-gray-300"
              />
              <div className="space-y-1 leading-none">
                <label className="text-xs text-gray-600">
                  I agree to the terms & policy
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-black hover:bg-black/90 text-white text-sm font-medium rounded-md mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-9 text-xs border border-gray-200 hover:bg-gray-50 rounded-md"
                onClick={() => handleOAuthSignUp("oauth_google")}
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                Sign up with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-9 text-xs border border-gray-200 hover:bg-gray-50 rounded-md"
                onClick={() => handleOAuthSignUp("oauth_apple")}
              >
                <FaApple className="mr-2 h-4 w-4" />
                Sign up with Apple
              </Button>
            </div>

            <p className="text-center text-xs text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:text-blue-500"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={RegistrationPhoto}
            alt="Red piggy bank with white polka dots"
            className="w-full h-full object-cover rounded-tl-3xl rounded-bl-3xl"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
