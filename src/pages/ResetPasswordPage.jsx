import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">SpendWise</h1>
          <p className="text-muted-foreground mt-2">Set your new password</p>
        </div>

        <UpdatePasswordForm />
      </div>
    </div>
  );
}
