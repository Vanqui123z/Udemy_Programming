"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { registerSchema, RegisterFormData } from "../../../schema/auth/registerSchema";
import { useMutationAuth } from "@/hooks/mutations/useMutationAuth";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {registerMutation} = useMutationAuth();
  const { mutate: registerUser, isPending  } = registerMutation;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="card-form">
      <div className="form-header">
        <h1 className="form-title">Create Your Account</h1>
        <p className="form-sub">
          Start your learning journey today
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="form"
      >
        {/* Full Name */}
        <Field error={errors.full_name?.message}>
          <input
            {...register("full_name")}
            type="text"
            placeholder="Full Name"
            className={`input ${
              errors.full_name ? "input-error" : ""
            }`}
            autoComplete="name"
          />
        </Field>

        {/* Email */}
        <Field error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            placeholder="Email address"
            className={`input ${
              errors.email ? "input-error" : ""
            }`}
            autoComplete="email"
          />
        </Field>

        {/* Password Row */}
        <div className="row-2">
          <Field error={errors.password?.message}>
            <div className="input-wrap">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`input input-padded ${
                  errors.password ? "input-error" : ""
                }`}
                autoComplete="new-password"
              />

              <EyeToggle
                show={showPassword}
                onToggle={() =>
                  setShowPassword((prev) => !prev)
                }
              />
            </div>
          </Field>

          <Field error={errors.confirmPassword?.message}>
            <div className="input-wrap">
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className={`input input-padded ${
                  errors.confirmPassword
                    ? "input-error"
                    : ""
                }`}
                autoComplete="new-password"
              />

              <EyeToggle
                show={showConfirm}
                onToggle={() =>
                  setShowConfirm((prev) => !prev)
                }
              />
            </div>
          </Field>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary"
        >
          {isPending && (
            <span
              className="spinner"
              aria-hidden="true"
            />
          )}

          {isPending
            ? "Creating account..."
            : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="divider">
          <span className="divider-line" />
          <span className="divider-text">
            or sign up with
          </span>
          <span className="divider-line" />
        </div>

        {/* OAuth */}
        <div className="oauth-row">
          <button
            type="button"
            className="oauth-btn"
            aria-label="Google"
          >
            <Image
              src="/icon/google-icon.svg"
              alt="Google"
              width={18}
              height={18}
            />
          </button>

          <button
            type="button"
            className="oauth-btn"
            aria-label="GitHub"
          >
            <Image
              src="/icon/github-icon.svg"
              alt="GitHub"
              width={18}
              height={18}
            />
          </button>
        </div>

        {/* Login */}
        <p className="signup-text">
          Already have an account?{" "}
          <a
            href="/login"
            className="signup-link"
          >
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}

function Field({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="field">
      {children}

      {error && (
        <span className="field-error">
          {error}
        </span>
      )}
    </div>
  );
}

function EyeToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="eye-btn"
      onClick={onToggle}
      aria-label={
        show ? "Hide password" : "Show password"
      }
    >
      {show ? (
        <EyeOff size={16} />
      ) : (
        <Eye size={16} />
      )}
    </button>
  );
}