import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { ArrowRight, Eye, EyeOff, MessagesSquare } from "lucide-react";

import { setUser } from "../store/authSlice.js";
import { login } from "../services/auth.services.js";
import { connectSocket } from "../socket/socket.js";
import OrbitAuthLayout from "../components/OrbitAuthLayout.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await login(formData);

      if (res) {
        dispatch(setUser(res.data));
        connectSocket();

        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error) {
      const message = error.message || "Login failed";

      setErr(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <OrbitAuthLayout>
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#e3efe8] text-[#285b4a]">
        <MessagesSquare size={22} strokeWidth={1.8} />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-orbit-text">
          Sign in
        </h2>

        <p className="text-sm text-orbit-muted mt-2">
          Welcome back to ORBIT.
        </p>
      </div>

      {/* Error */}

      {err && (
        <div
          className="
            mb-5
            rounded-xl
            border border-orbit-danger/20
            bg-orbit-danger/10
            px-4 py-3
          "
        >
          <p className="text-sm text-orbit-danger">
            {err}
          </p>
        </div>
      )}

      <div className="space-y-5">

        {/* Email */}

        <div>
          <label className="block text-sm text-orbit-muted mb-2">
            Email address
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => {
              setErr("");

              setFormData({
                ...formData,
                email: e.target.value,
              });
            }}
            onKeyDown={handleKeyDown}
            className="
              w-full h-12
              rounded-xl
              bg-orbit-surface
              px-4
              text-sm text-orbit-text
              placeholder:text-orbit-muted
              border border-orbit-line
              outline-none
              transition-all
              focus:border-orbit-primary
              focus:ring-2
              focus:ring-orbit-primary/10
            "
          />
        </div>

        {/* Username */}

        <div>
          <label className="block text-sm text-orbit-muted mb-2">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter your username"
            value={formData.userName}
            onChange={(e) => {
              setErr("");

              setFormData({
                ...formData,
                userName: e.target.value,
              });
            }}
            onKeyDown={handleKeyDown}
            className="
              w-full h-12
              rounded-xl
              bg-orbit-surface
              px-4
              text-sm text-orbit-text
              placeholder:text-orbit-muted
              border border-orbit-line
              outline-none
              transition-all
              focus:border-orbit-primary
              focus:ring-2
              focus:ring-orbit-primary/10
            "
          />
        </div>

        {/* Password */}

        <div>
          <label className="block text-sm text-orbit-muted mb-2">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              value={formData.password}
              onChange={(e) => {
                setErr("");

                setFormData({
                  ...formData,
                  password: e.target.value,
                });
              }}
              onKeyDown={handleKeyDown}
              className="
                w-full h-12
                rounded-xl
                bg-orbit-surface
                px-4 pr-12
                text-sm text-orbit-text
                placeholder:text-orbit-muted
                border border-orbit-line
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
                absolute right-4 top-1/2
                -translate-y-1/2
                text-orbit-muted
                hover:text-orbit-primary
                transition-colors
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

        {/* Forgot password */}

        <div className="flex justify-end -mt-1">
          <Link
            to="/forgot-password"
            className="
              text-sm
              text-orbit-muted
              hover:text-orbit-primary
              transition-colors
            "
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}

        <button
          onClick={handleLogin}
          disabled={
            loading ||
            !formData.email ||
            !formData.password ||
            !formData.userName
          }
          className="
            w-full h-12
            rounded-full
            bg-orbit-primary
            hover:bg-orbit-primary-hover
            active:scale-[0.99]
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-white
            font-semibold
            text-sm
            transition-all
          "
        >
          <span>{loading ? "Signing in..." : "Sign in"}</span>
          {!loading && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </div>

      {/* Register */}

      <p className="text-center text-sm text-orbit-muted mt-8">
        Don't have an account?{" "}

        <Link
          to="/register"
          className="
            text-orbit-primary
            hover:text-orbit-primary-hover
            font-medium
            transition-colors
          "
        >
          Create one
        </Link>
      </p>
    </OrbitAuthLayout>
  );
};

export default Login;