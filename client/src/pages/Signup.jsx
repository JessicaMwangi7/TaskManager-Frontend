import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import API from "../api/axios"; // ✅ shared API instance

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(""); // ✅ camelCase for React
  const [lastName, setLastName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast.error("You must agree to the terms.");
      return;
    }
    try {
      setIsLoading(true);
      await API.post("/auth/signup", {
        email,
        password,
        first_name: firstName, // ✅ snake_case → matches Flask
        last_name: lastName,
      });
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.error || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-1">Sign Up</h1>
          <p className="text-gray-600 text-sm mb-6">Create your account below.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-start space-x-2 pt-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to the terms & policy
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-500">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right image column */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-200">
        <img
          src="/images/signup-photo.jpg"
          alt="Sign Up Visual"
          className="max-w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Signup;
