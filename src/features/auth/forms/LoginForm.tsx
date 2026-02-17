"use client";

import { loginAction } from "@/src/features/auth/actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import { useActionState, useEffect, useState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginInput,
} from "@/src/features/auth/validators/auth.schema";
import AuthShell from "@/src/features/auth/components/AuthShell";
import AuthHeader from "@/src/features/auth/components/AuthHeader";
import AuthFooter from "@/src/features/auth/components/AuthFooter";
import SubmitButton from "@/src/features/auth/components/SubmitButton";

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (state?.error) {
      setIsSubmitting(false);
    }
  }, [state]);

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

        {(state?.error || errors.email || errors.password) && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-xl flex gap-3 items-start">
            <span className="material-symbols-outlined text-danger text-xl">
              error
            </span>
            <div className="text-sm text-danger font-medium">
              {state?.error ||
                errors.email?.message ||
                errors.password?.message}
            </div>
          </div>
        )}

        <form
          className="space-y-6"
          noValidate
          onSubmit={handleSubmit((data) => {
            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("email", data.email);
            formData.append("password", data.password);

            startTransition(() => {
              formAction(formData);
            });
          })}
        >
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
                placeholder="name@company.com"
                type="email"
                {...register("email")}
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
                placeholder="••••••••"
                type="password"
                {...register("password")}
              />
            </div>
          </div>

          <SubmitButton
            className="cursor-pointer"
            text="Sign In"
            loadingText="Signing in..."
            loading={isSubmitting}
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
