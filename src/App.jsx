import { Outlet, useLocation } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Only show NavBar when not on dashboard routes */}
      {!isDashboardRoute && <NavBar />}

      <main className="flex-1">
        <Outlet />
      </main>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;
