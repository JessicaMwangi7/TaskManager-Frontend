import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import loginPhoto from "../assets/photos/Login.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoaded: clerkLoaded } = useSignIn();
  const { isAuthenticated, setUser } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clerkLoaded) {
      toast.error("Authentication system is loading. Please try again.");
      return;
    }

    try {
      setIsLoading(true);

      //  sign-in process with Clerk
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        // Complete the sign-in
        const userData = {
          id: result.createdUserId,
          email: email,
        };
        setUser(userData);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        // !TODOs ->teps if needed (like 2FA)
        console.log(result);
        toast.info("Additional verification required");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.errors?.[0]?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (strategy) => {
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      console.error("OAuth sign-in error:", error);
      toast.error("Failed to initiate OAuth sign-in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-1/2 p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Hello again!</h1>
          <p className="text-muted-foreground mb-8">
            Login to access your account :)
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot your password?
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <label
                htmlFor="remember"
                className="text-xs text-muted-foreground"
              >
                Remember for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => handleOAuthSignIn("oauth_google")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="18"
                  height="18"
                  className="mr-2"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Google
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={() => handleOAuthSignIn("oauth_apple")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="mr-2"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm-1.834 15.458c-.111 0-.214-.036-.302-.106-.115-.093-.173-.239-.173-.436v-4.916h-1.691v4.916c0 .197-.058.343-.173.436-.089.07-.192.106-.302.106-.12 0-.223-.036-.313-.106-.115-.093-.172-.239-.172-.436v-4.916h-1.68v-1.25h1.68v-1.937c0-.886.248-1.561.743-2.028.496-.466 1.156-.699 1.982-.699.696 0 1.225.173 1.585.52.36.347.54.832.54 1.455 0 .505-.129.933-.389 1.284-.26.35-.606.527-1.04.527-.364 0-.673-.121-.927-.36-.254-.24-.381-.547-.381-.923 0-.364.12-.667.359-.908.24-.242.526-.363.859-.363.23 0 .444.073.644.219l.22.22c.089.089.155.168.198.237.044.069.067.135.067.198 0 .098-.036.178-.106.238-.07.06-.155.106-.254.136-.098.03-.19.053-.278.067-.087.013-.18.02-.278.02h-.359v.678h.376c.326 0 .599.083.82.25.22.167.33.416.33.747 0 .331-.11.577-.33.737-.22.16-.494.24-.82.24h-.376v1.937c0 .197-.061.343-.184.436-.124.093-.289.139-.498.139zm4.834 0c-.12 0-.228-.036-.324-.106-.115-.093-.173-.239-.173-.436v-4.916h-1.68v-1.25h1.68v-1.937c0-.886.248-1.561.743-2.028.496-.466 1.156-.699 1.982-.699.696 0 1.225.173 1.585.52.36.347.54.832.54 1.455 0 .505-.129.933-.389 1.284-.26.35-.606.527-1.04.527-.364 0-.673-.121-.927-.36-.254-.24-.381-.547-.381-.923 0-.364.12-.667.359-.908.24-.242.526-.363.859-.363.23 0 .444.073.644.219l.22.22c.089.089.155.168.198.237.044.069.067.135.067.198 0 .098-.036.178-.106.238-.07.06-.155.106-.254.136-.098.03-.19.053-.278.067-.087.013-.18.02-.278.02h-.359v.678h.376c.326 0 .599.083.82.25.22.167.33.416.33.747 0 .331-.11.577-.33.737-.22.16-.494.24-.82.24h-.376v1.937c0 .197-.061.343-.184.436-.124.093-.289.139-.498.139z" />
                </svg>
                Apple
              </Button>
            </div>
          </form>

          <div className="text-center text-sm mt-6">
            <span className="text-muted-foreground">
              Don't have an account?
            </span>{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section - Background Image */}
      <div className="hidden md:block md:w-1/2 bg-muted rounded-l-[140px] overflow-hidden">
        <div className="h-full relative">
          <img
            src={loginPhoto}
            alt="Login Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
