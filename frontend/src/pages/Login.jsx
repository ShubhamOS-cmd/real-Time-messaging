import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";

import { Camera, Eye, EyeOff } from "lucide-react";

import { setUser } from "../store/authSlice.js";
import { login } from "../services/auth.services.js";
import { connectSocket } from "../socket/socket.js";
// add handle the forgot password 
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [err, seterr] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await login(formData);
      if (res) {
        console.log(res);
        dispatch(setUser(res.data));
        connectSocket();
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error) {
      const message = error.message || "Login failed";
      toast.error(message);
      seterr(message);
    } finally {
      setLoading(false);
    }
  };

  // const handleKeyDown = (e) => {
  //     if (e.key === "Enter") handleLogin()
  // }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#4F8EF7] opacity-[0.07] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E8EEFF] tracking-tight">
            wave<span className="text-[#4F8EF7]">.</span>
          </h1>
          <p className="text-[#8899BB] text-sm mt-1">Welcome back</p>
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
          <h2 className="text-[#E8EEFF] font-semibold text-lg mb-6">Sign in</h2>

          <div className="space-y-4">
            <div>
              <label className="text-[#8899BB] text-sm mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => {
                  seterr("");
                  setFormData({ ...formData, email: e.target.value });
                }}
                // onKeyDown={handleKeyDown}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-[#8899BB] text-sm mb-1.5 block">
                UserName
              </label>
              <input
                type="text"
                placeholder="Enter your UserName"
                value={formData.userName}
                onChange={(e) => {
                  seterr("");
                  setFormData({ ...formData, userName: e.target.value });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="text-[#8899BB] text-xs mb-1.5 block">
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-11 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8899BB] hover:text-white transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={
                loading ||
                !formData.email ||
                !formData.password ||
                !formData.userName
              }
              className="w-full bg-[#4F8EF7] hover:bg-[#3A7AF0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="text-center text-[#8899BB] text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#4F8EF7] hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-center text-[#8899BB] text-sm mt-6">
            Forgot Passoword?{" "}
            <Link
              to="/forgot-password"
              className="text-[#4F8EF7] hover:underline"
            > 
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
      {err && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-red-400 text-sm text-center">{err}</p>
        </div>
      )}
    </div>
  );
};

export default Login;
