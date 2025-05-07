import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import routes from "./routes";
import { ClerkProvider } from "@clerk/clerk-react";
import { queryClient } from "./lib/query-client";

//  Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Configure axios defaults
const isDev = import.meta.env.MODE === "development";
axios.defaults.baseURL = isDev
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

// Create router
const router = createBrowserRouter(routes);

// Render application
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/login"
      signUpUrl="/register"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/verify-email"
      afterVerifyEmailUrl="/dashboard"
      fallbackRedirectUrl="/dashboard"
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {isDev && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
);
