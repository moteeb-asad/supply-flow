import LoginForm from "@/src/components/auth/LoginForm";
import LoginBranding from "@/src/components/auth/LoginBranding";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <LoginForm />
      <LoginBranding />
    </div>
  );
}
