"use client";

import { loginAction } from "@/src/actions/auth.actions";
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      type="submit"
      disabled={pending}
    >
      <span>{pending ? "Signing in..." : "Sign In"}</span>
      <span className="material-symbols-outlined text-xl">login</span>
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, undefined);

  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 bg-white">
      {/* Mobile Logo */}
      <div className="flex items-center gap-3 lg:hidden mb-12">
        <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
          <span className="material-symbols-outlined">inventory_2</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#0e121b]">
          SupplyFlow
        </h1>
      </div>

      {/* Login Form */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 font-medium">
            Please enter your internal credentials to access the portal.
          </p>
        </div>

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
              <input
                autoComplete="email"
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
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
                href="#"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                lock
              </span>
              <input
                autoComplete="current-password"
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm outline-none"
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

          <SubmitButton />
        </form>
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto pt-12">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex gap-4">
          <span className="material-symbols-outlined text-gray-400">
            lock_person
          </span>
          <div>
            <p className="text-xs leading-relaxed text-gray-500">
              <strong>Invite-Only Portal:</strong> Access to SupplyFlow is
              strictly for authorized personnel. If you are an employee or
              supplier without access, please contact your{" "}
              <a
                className="text-primary font-semibold underline decoration-primary/30"
                href="#"
              >
                System Administrator
              </a>{" "}
              for an invitation.
            </p>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-widest font-bold">
          © 2026 SupplyFlow Operations. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
