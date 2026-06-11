"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useMutationAuth } from "../../../hooks/useMutationAuth";
import Logo from "../../../components/ui/logoCode";
import Image from "next/image";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loginMutation } = useMutationAuth();
  const { mutate: login, isPending } = loginMutation;

  const {register,handleSubmit,formState: { errors },} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    login(data);
  };

  return (
    <>
      {/* Right panel – form */}
      <div className="card-form">
        <div className="form-header">
          <Logo />
          <h1 className="form-title">Welcome Back</h1>
          <p className="form-sub">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
          {/* Email */}
          <div className="field">
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className={`input ${errors.email ? "input-error" : ""}`}
              autoComplete="email"
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="field">
            <div className="input-wrap">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`input input-padded ${errors.password ? "input-error" : ""}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>

          {/* Forgot */}
          <div className="forgot-row">
            <a href="/auth/forgetPass" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isPending} className="btn-primary">
            {isPending ? (
              <span className="spinner" aria-hidden="true" />
            ) : null}
            {isPending ? "Signing in…" : "Sign In"}
          </button>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">or sign in with</span>
            <span className="divider-line" />
          </div>

          {/* OAuth */}
          <div className="oauth-row">
            <button type="button" className="oauth-btn" aria-label="Sign in with Google"   onClick={() => signIn("google", { callbackUrl: "/home" })}>
              <Image src="/icon/google-icon.svg" width={20} height={20} alt="Google" />
            </button>
            <button type="button" className="oauth-btn" aria-label="Sign in with GitHub" onClick={() => signIn("github", { callbackUrl: "/home" })}>
              <Image src="/icon/github-icon.svg" width={20} height={20} alt="GitHub" />
            </button>
          </div>

          {/* Sign up */}
          <p className="signup-text">
            Don&apos;t have an account?{" "}
            <a href="/auth/register" className="signup-link">
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </>
  );
}





