// /src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import API from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      console.log("Login response:", res.data);

      const { access_token, user_id, first_name, last_name } = res.data;

      if (access_token) {
        // ✅ pass full user object to context
        const userData = { id: user_id, first_name, last_name, email };
        login(userData, access_token);
        toast.success(`Welcome${first_name ? `, ${first_name}` : ""}!`);
        navigate("/dashboard");
      } else {
        toast.error("No token received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-500 mb-6">Login to access your account :)</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email address</label>
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
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex justify-end text-xs">
            <a href="#" className="text-blue-600 hover:underline">Forgot your password?</a>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-center text-sm mt-6">
          <span className="text-gray-600">Don’t have an account?</span>{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
