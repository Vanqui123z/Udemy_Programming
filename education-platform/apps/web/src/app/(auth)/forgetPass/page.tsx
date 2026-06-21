"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import Logo from "../../../components/logoCode/logoCode";
import {ForgetPassSchema,ForgetPassFormData} from "../../../schema/auth/ForgetPassSchema";

import { useMutationAuth } from "@/hooks/mutations/useMutationAuth";

export default function ForgetPasswordPage() {
  const [enterPassword, setEnterPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { forgotPasswordMutation, resetPasswordMutation } = useMutationAuth();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgetPassFormData>({
    resolver: zodResolver(ForgetPassSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSendOTP = () => {
    const email = getValues("email");
    if (!email) {
      alert("Please enter email first");
      return;
    }

    forgotPasswordMutation.mutate({ email }, {
      onSuccess: () => {
        setEnterPassword(true);
      },
    });
  };

  const onSubmit = (data: ForgetPassFormData) => {
    resetPasswordMutation.mutate(data);
  };

  return (
    <div>
      <div className="card-form">
        <div className="form-header">
          <Logo />
          <h1 className="form-title">Forget Password</h1>
          <p className="form-sub">Confirm your email</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="form"
        >
          {/* Email */}
          <div className="field">
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className={`input ${
                errors.email ? "input-error" : ""
              }`}
            />

            {errors.email && (
              <span className="field-error">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Send OTP */}
          {!enterPassword && (
            <button
              type="button"
              onClick={onSendOTP}
              disabled={forgotPasswordMutation.isPending}
              className="btn-primary"
          >
            {forgotPasswordMutation.isPending && (
              <span className="spinner" />
            )}

            {forgotPasswordMutation.isPending
              ? "Sending..."
              : "Send OTP"}
          </button>
          )}

          {enterPassword && (
            <>
              {/* OTP */}
              <div className="field">
                <input
                  {...register("otp")}
                  type="text"
                  placeholder="OTP"
                  className={`input ${
                    errors.otp ? "input-error" : ""
                  }`}
                />

                {errors.otp && (
                  <span className="field-error">
                    {errors.otp.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="field">
                <div className="input-wrap">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`input input-padded ${
                      errors.password ? "input-error" : ""
                    }`}
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <span className="field-error">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="field">
                <div className="input-wrap">
                  <input
                    {...register("confirmPassword")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className={`input input-padded ${
                      errors.confirmPassword
                        ? "input-error"
                        : ""
                    }`}
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span className="field-error">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              {/* Reset Password */}
              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="btn-primary"
              >
                {resetPasswordMutation.isPending && (
                  <span className="spinner" />
                )}

                {resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </>
          )}

          <p className="signup-text">
            You have an account?{" "}
            <a href="/login" className="signup-link">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}