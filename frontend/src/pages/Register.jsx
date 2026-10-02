import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Camera, Eye, EyeOff } from "lucide-react";

import { setUser } from "../store/authSlice.js";
import {
  otpRequest,
  otpVerify,
  register,
} from "../services/auth.services.js";
import { connectSocket } from "../socket/socket.js";
import OrbitAuthLayout from "../components/OrbitAuthLayout.jsx";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    password: "",
    DOB: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // -----------------------------
  // Avatar
  // -----------------------------

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // -----------------------------
  // Step 1 — Request OTP
  // -----------------------------

  const handleRequestOTP = async () => {
    try {
      setLoading(true);

      await otpRequest({
        email,
        type: "register",
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
        type: "register",
      });

      toast.success("Email verified");
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
  // Step 3 — Register
  // -----------------------------

  const handleRegister = async () => {
    if (!avatarFile) {
      toast.error("Please upload a profile photo");
      return;
    }

    try {
      setLoading(true);

      const res = await register({
        ...formData,
        email,
        avatar: avatarFile,
      });

      if (res) {
        dispatch(setUser(res.data));
        connectSocket();

        toast.success("Account created!");
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Registration failed"
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
            Create your account
          </h1>

          <p className="mt-2 text-sm text-orbit-muted">
            Join ORBIT and start connecting.
          </p>
        </div>

        {/* ================= STEP INDICATOR ================= */}

        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                    step >= s
                      ? "bg-orbit-primary text-orbit-on-primary"
                      : "border border-orbit-line bg-orbit-surface text-orbit-muted"
                  }`}
                >
                  {s}
                </div>

                {s < 3 && (
                  <div
                    className={`h-px w-10 transition-all duration-300 ${
                      step > s
                        ? "bg-orbit-primary"
                        : "bg-orbit-line"
                    }`}
                  />
                )}
              </div>
            ))}

            <span className="ml-3 text-xs font-medium text-orbit-muted">
              {step === 1 && "Enter email"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Your details"}
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

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending OTP..." : "Send OTP"}
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
                We sent a verification code to{" "}
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
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                maxLength={6}
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
              {loading ? "Verifying..." : "Verify OTP"}
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
            {/* Avatar */}

            <div className="flex flex-col items-center">
              <label
                htmlFor="avatar-upload"
                className="group relative cursor-pointer"
              >
                <div
                  className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-2xl
                    border
                    border-orbit-line
                    bg-orbit-surface
                    transition-all
                    group-hover:border-orbit-primary
                  "
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera
                      size={24}
                      className="text-orbit-muted"
                    />
                  )}
                </div>

                <div
                  className="
                    absolute
                    -bottom-1
                    -right-1
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-orbit-bg
                    bg-orbit-primary
                  "
                >
                  <Camera
                    size={13}
                    className="text-orbit-on-primary"
                  />
                </div>
              </label>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <p className="mt-2 max-w-[220px] truncate text-xs text-orbit-muted">
                {avatarFile
                  ? avatarFile.name
                  : "Upload a profile photo"}
              </p>
            </div>

            {/* Name + Username */}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-medium text-orbit-text">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fullName: e.target.value,
                    })
                  }
                  className="
                    orbit-field
                    h-11
                    px-3
                    outline-none
                    transition-all
                    focus:border-orbit-primary
                    focus:ring-2
                    focus:ring-orbit-primary/10
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-orbit-text">
                  Username
                </label>

                <input
                  type="text"
                  placeholder="john_doe"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userName: e.target.value,
                    })
                  }
                  className="
                    orbit-field
                    h-11
                    px-3
                    outline-none
                    transition-all
                    focus:border-orbit-primary
                    focus:ring-2
                    focus:ring-orbit-primary/10
                  "
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block text-xs font-medium text-orbit-text">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="
                    orbit-field
                    h-11
                    px-4
                    pr-11
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
                    setShowPassword((prev) => !prev)
                  }
                  className="
                    absolute
                    right-3
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

            {/* DOB */}

            <div>
              <label className="mb-2 block text-xs font-medium text-orbit-text">
                Date of Birth
              </label>

              <input
                type="date"
                value={formData.DOB}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    DOB: e.target.value,
                  })
                }
                className="
                  orbit-field
                  h-11
                  px-4
                  outline-none
                  transition-all
                  focus:border-orbit-primary
                  focus:ring-2
                  focus:ring-orbit-primary/10
                "
              />
            </div>

            {/* Create Account */}

            <button
              onClick={handleRegister}
              disabled={
                loading ||
                !formData.fullName ||
                !formData.userName ||
                !formData.password ||
                !formData.DOB ||
                !avatarFile
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
                ? "Creating account..."
                : "Create account"}
            </button>
          </div>
        )}

        {/* ================= LOGIN ================= */}

        <p className="mt-7 text-center text-sm text-orbit-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-semibold
              text-orbit-primary
              transition-colors
              hover:text-orbit-primary-hover
            "
          >
            Login
          </Link>
        </p>
      </div>
    </OrbitAuthLayout>
  );
};

export default Register;