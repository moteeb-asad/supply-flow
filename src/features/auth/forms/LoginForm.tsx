"use client";

import Link from "next/link";
import { loginAction } from "@/src/features/auth/actions/auth.actions";
import { Input } from "@/src/components/ui/Input";
import FormErrorBanner from "@/src/components/ui/FormErrorBanner";
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

const labelClassName = "text-[13px] font-medium";

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

  const errorMessage =
    state?.error || errors.email?.message || errors.password?.message;

  return (
    <AuthShell>
      <AuthHeader
        title="Sign in to SupplyFlow"
        subtitle="Use the work email your administrator invited."
      />

      <FormErrorBanner message={errorMessage} className="mb-5" />

      <form
        className="space-y-5"
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
          <label className={labelClassName} htmlFor="email">
            Email
          </label>
          <Input
            aria-invalid={errors.email ? true : undefined}
            autoComplete="email"
            className="mt-1.5"
            id="email"
            placeholder="name@company.com"
            type="email"
            {...register("email")}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className={labelClassName} htmlFor="password">
              Password
            </label>
            <Link
              className="text-[13px] font-medium text-primary hover:underline"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            aria-invalid={errors.password ? true : undefined}
            autoComplete="current-password"
            className="mt-1.5"
            id="password"
            type="password"
            {...register("password")}
          />
        </div>

        <SubmitButton
          text="Sign in"
          loadingText="Signing in..."
          loading={isPending}
        />
      </form>

      <AuthFooter />
    </AuthShell>
  );
}
