import { Link } from "react-router-dom";

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold">SpendWise</h1>
          </Link>
          <p className="text-muted-foreground mt-2">
            Manage your finances with ease
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
