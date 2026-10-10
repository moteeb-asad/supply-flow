"use client";

import { loginAction } from "@/src/features/auth/actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import { useActionState, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <AuthShell>
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-white">
          <span className="material-symbols-outlined">inventory_2</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-ink">
          SupplyFlow
        </h1>
      </div>

      <div className="max-w-md w-full mx-auto my-auto">
        <AuthHeader
          title="Welcome Back"
          subtitle="Please enter your internal credentials to access the portal."
        />

        {(state?.error || errors.email || errors.password) && (
          <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger/10 p-3">
            <span className="material-symbols-outlined !text-[20px] text-danger">
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
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit((data) => {
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
              className="mb-1.5 block text-sm font-semibold text-gray-700"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[18px]">
                mail
              </span>
              <Input
                autoComplete="email"
                className="rounded-lg py-2.5 pl-9 pr-3 text-sm"
                id="email"
                placeholder="name@company.com"
                type="email"
                {...register("email")}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
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
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[18px]">
                lock
              </span>
              <Input
                autoComplete="current-password"
                className="rounded-lg py-2.5 pl-9 pr-3 text-sm"
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
            loading={isPending}
            icon={
              <span className="material-symbols-outlined !text-[18px]">login</span>
            }
          />
        </form>
      </div>

      <AuthFooter />
    </AuthShell>
  );
}
