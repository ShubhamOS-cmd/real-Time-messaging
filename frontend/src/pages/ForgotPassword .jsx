import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { Eye, EyeOff } from "lucide-react";

import {
  otpRequest,
  otpVerify,
  changePassword,
} from "../services/auth.services.js";

import OrbitAuthLayout from "../components/OrbitAuthLayout.jsx";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // -----------------------------
  // Step 1 — Request OTP
  // -----------------------------

  const handleRequestOTP = async () => {
    try {
      setLoading(true);

      await otpRequest({
        email,
        type: "password-reset",
      });

      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Step 2 — Verify OTP
  // -----------------------------

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      await otpVerify({
        email,
        otp,
        type: "password-reset",
      });

      toast.success("OTP verified");
      setStep(3);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Step 3 — Reset Password
  // -----------------------------

  const handleResetPassword = async () => {
    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error(
        "Password must be at least 8 characters"
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        email,
        password: passwords.newPassword,
      });

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrbitAuthLayout>
      <div className="w-full max-w-md">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-orbit-text">
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-orbit-muted">
            Recover your ORBIT account securely.
          </p>
        </div>

        {/* ================= STEP INDICATOR ================= */}

        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-semibold
                    transition-all
                    duration-300
                    ${
                      step >= s
                        ? "bg-orbit-primary text-orbit-on-primary"
                        : "border border-orbit-line bg-orbit-surface text-orbit-muted"
                    }
                  `}
                >
                  {s}
                </div>

                {s < 3 && (
                  <div
                    className={`
                      h-px
                      w-10
                      transition-all
                      duration-300
                      ${
                        step > s
                          ? "bg-orbit-primary"
                          : "bg-orbit-line"
                      }
                    `}
                  />
                )}
              </div>
            ))}

            <span className="ml-3 text-xs font-medium text-orbit-muted">
              {step === 1 && "Enter email"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "New password"}
            </span>
          </div>
        </div>

        {/* ================= STEP 1 ================= */}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-orbit-text">
                Email address
              </label>

              <p className="mb-3 text-xs text-orbit-muted">
                We'll send an OTP to reset your password.
              </p>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleRequestOTP();
                  }
                }}
                className="
                  orbit-field
                  h-12
                  outline-none
                  transition-all
                  focus:border-orbit-primary
                  focus:ring-2
                  focus:ring-orbit-primary/10
                "
              />
            </div>

            <button
              onClick={handleRequestOTP}
              disabled={loading || !email}
              className="
                w-full
                min-h-12
                rounded-full
                bg-orbit-primary
                text-sm
                font-semibold
                text-orbit-on-primary
                transition-all
                hover:bg-orbit-primary-hover
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-orbit-text">
                Enter OTP
              </label>

              <p className="mb-3 text-xs text-orbit-muted">
                Sent to{" "}
                <span className="font-medium text-orbit-text">
                  {email}
                </span>
              </p>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                maxLength={6}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleVerifyOTP();
                  }
                }}
                className="
                  orbit-field
                  h-12
                  text-center
                  tracking-[0.35em]
                  outline-none
                  transition-all
                  focus:border-orbit-primary
                  focus:ring-2
                  focus:ring-orbit-primary/10
                  placeholder:tracking-normal
                "
              />
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length < 6}
              className="
                w-full
                min-h-12
                rounded-full
                bg-orbit-primary
                text-sm
                font-semibold
                text-orbit-on-primary
                transition-all
                hover:bg-orbit-primary-hover
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="
                w-full
                text-sm
                font-medium
                text-orbit-muted
                transition-colors
                hover:text-orbit-primary
              "
            >
              Change email
            </button>
          </div>
        )}

        {/* ================= STEP 3 ================= */}

        {step === 3 && (
          <div className="space-y-5">
            {/* New Password */}

            <div>
              <label className="mb-2 block text-sm font-medium text-orbit-text">
                New password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Min 8 characters"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      newPassword: e.target.value,
                    })
                  }
                  className="
                    orbit-field
                    h-12
                    pr-12
                    outline-none
                    transition-all
                    focus:border-orbit-primary
                    focus:ring-2
                    focus:ring-orbit-primary/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-orbit-muted
                    transition-colors
                    hover:text-orbit-primary
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="mb-2 block text-sm font-medium text-orbit-text">
                Confirm password
              </label>

              <input
                type="password"
                placeholder="Repeat your password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleResetPassword();
                  }
                }}
                className={`
                  orbit-field
                  h-12
                  outline-none
                  transition-all
                  ${
                    passwords.confirmPassword &&
                    passwords.newPassword !==
                      passwords.confirmPassword
                      ? "border-orbit-danger focus:border-orbit-danger focus:ring-orbit-danger/10"
                      : "focus:border-orbit-primary focus:ring-2 focus:ring-orbit-primary/10"
                  }
                `}
              />

              {passwords.confirmPassword &&
                passwords.newPassword !==
                  passwords.confirmPassword && (
                  <p className="mt-1.5 text-xs text-orbit-danger">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Reset */}

            <button
              onClick={handleResetPassword}
              disabled={
                loading ||
                !passwords.newPassword ||
                !passwords.confirmPassword ||
                passwords.newPassword !==
                  passwords.confirmPassword
              }
              className="
                w-full
                min-h-12
                rounded-full
                bg-orbit-primary
                text-sm
                font-semibold
                text-orbit-on-primary
                transition-all
                hover:bg-orbit-primary-hover
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Resetting..."
                : "Reset password"}
            </button>
          </div>
        )}

        {/* ================= FOOTER ================= */}

        <p className="mt-7 text-center text-sm text-orbit-muted">
          Remember your password?{" "}
          <Link
            to="/login"
            className="
              font-semibold
              text-orbit-primary
              transition-colors
              hover:text-orbit-primary-hover
            "
          >
            Sign in
          </Link>
        </p>
      </div>
    </OrbitAuthLayout>
  );
};

export default ForgotPassword;