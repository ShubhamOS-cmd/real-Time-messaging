import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { Camera, Eye, EyeOff } from "lucide-react";

import {
  otpRequest,
  otpVerify,
  changePassword,
} from "../services/auth.services.js";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Step 1 — send OTP
  const handleRequestOTP = async () => {
    try {
      setLoading(true);
      await otpRequest({ email, type: "password-reset" });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — verify OTP
  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      await otpVerify({ email, otp, type: "password-reset" });
      toast.success("OTP verified");
      setStep(3);
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Invalid OTP",
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — reset password
  const handleResetPassword = async () => { // handle reset password 
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    try {
      setLoading(true);
      await changePassword({ email, password: passwords.newPassword });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Reset failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#4F8EF7] opacity-[0.07] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E8EEFF] tracking-tight">
            orbit<span className="text-[#4F8EF7]">chat</span>
          </h1>
          <p className="text-[#8899BB] text-sm mt-1">Reset your password</p>
        </div>

        {/* Glass card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 25px 45px rgba(0,0,0,0.3)",
          }}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    step >= s
                      ? "bg-[#4F8EF7] text-white"
                      : "bg-white/10 text-[#8899BB]"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-px w-12 transition-all duration-300 ${step > s ? "bg-[#4F8EF7]" : "bg-white/10"}`}
                  />
                )}
              </div>
            ))}
            <span className="ml-2 text-[#8899BB] text-xs">
              {step === 1 && "Enter email"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "New password"}
            </span>
          </div>

          {/* Step 1 — Email */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-[#8899BB] text-sm mb-1.5 block">
                  Email address
                </label>
                <p className="text-[#8899BB]/60 text-xs mb-3">
                  We'll send an OTP to reset your password
                </p>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRequestOTP()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
                />
              </div>
              <button
                onClick={handleRequestOTP}
                disabled={loading || !email}
                className="w-full bg-[#4F8EF7] hover:bg-[#3A7AF0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-[#8899BB] text-sm mb-1.5 block">
                  Enter OTP
                </label>
                <p className="text-[#8899BB]/60 text-xs mb-3">
                  Sent to {email}
                </p>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm tracking-widest"
                />
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length < 6}
                className="w-full bg-[#4F8EF7] hover:bg-[#3A7AF0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-[#8899BB] hover:text-[#E8EEFF] text-sm transition-colors"
              >
                Change email
              </button>
            </div>
          )}

          {/* Step 3 — New Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-[#8899BB] text-sm mb-1.5 block">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 pr-12 py-3 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8899BB] hover:text-white transition-colors"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[#8899BB] text-sm mb-1.5 block">
                  Confirm Password
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
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none transition-colors text-sm ${
                    passwords.confirmPassword &&
                    passwords.newPassword !== passwords.confirmPassword
                      ? "border-[#FF4D6D] focus:border-[#FF4D6D]"
                      : "border-white/10 focus:border-[#4F8EF7]"
                  }`}
                />
                {/* password mismatch hint */}
                {passwords.confirmPassword &&
                  passwords.newPassword !== passwords.confirmPassword && (
                    <p className="text-[#FF4D6D] text-xs mt-1.5">
                      Passwords do not match
                    </p>
                  )}
              </div>
              <button
                onClick={handleResetPassword}
                disabled={
                  loading ||
                  !passwords.newPassword ||
                  !passwords.confirmPassword ||
                  passwords.newPassword !== passwords.confirmPassword
                }
                className="w-full bg-[#4F8EF7] hover:bg-[#3A7AF0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-[#8899BB] text-sm mt-6">
            Remember your password?{" "}
            <Link to="/login" className="text-[#4F8EF7] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
