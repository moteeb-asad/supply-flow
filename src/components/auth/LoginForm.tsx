"use client";

import { loginAction } from "@/src/actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import { useActionState } from "react";
import AuthShell from "@/src/components/auth/AuthShell";
import AuthHeader from "@/src/components/auth/AuthHeader";
import AuthFooter from "@/src/components/auth/AuthFooter";
import SubmitButton from "./SubmitButton";

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, undefined);

  return (
    <AuthShell>
      <div className="flex items-center gap-3 lg:hidden mb-12">
        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined">inventory_2</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#0e121b]">
          SupplyFlow
        </h1>
      </div>

      <div className="max-w-md w-full mx-auto my-auto">
        <AuthHeader
          title="Welcome Back"
          subtitle="Please enter your internal credentials to access the portal."
        />

        {state?.error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-danger text-xl">
              error
            </span>
            <p className="text-sm text-danger font-medium">{state.error}</p>
          </div>
        )}

        <form className="space-y-6" action={formAction}>
          <div>
            <label
              className="block text-sm font-semibold text-gray-700 mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                mail
              </span>
              <Input
                autoComplete="email"
                className="pl-10 pr-4 text-sm"
                id="email"
                name="email"
                placeholder="name@company.com"
                required
                type="email"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-sm font-semibold text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <a
                className="text-xs font-bold text-primary hover:underline"
                href="/forgot-password"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                lock
              </span>
              <Input
                autoComplete="current-password"
                className="pl-10 pr-4 text-sm"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type="password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              id="remember-me"
              name="remember-me"
              type="checkbox"
            />
            <label
              className="ml-2 block text-sm text-gray-600"
              htmlFor="remember-me"
            >
              Remember this device for 30 days
            </label>
          </div>

          <SubmitButton
            text="Sign In"
            loadingText="Signing in..."
            icon={
              <span className="material-symbols-outlined text-xl">login</span>
            }
          />
        </form>
      </div>

      <AuthFooter />
    </AuthShell>
  );
}
