import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router"
import toast from "react-hot-toast"
import { Camera } from "lucide-react"

import { setUser } from "../store/authSlice.js"
import { otpRequest, otpVerify, register } from "../services/auth.services.js"
import { connectSocket } from "../socket/socket.js"

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)   // 1=email, 2=otp, 3=details
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [formData, setFormData] = useState({
        fullName: "",
        userName: "",
        password: "",
        DOB: ""
    })

    // avatar state
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0]
        console.log(file);
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be under 5MB")
            return
        }

        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    // Step 1 — request OTP
    const handleRequestOTP = async () => {
        try {
            setLoading(true)
            await otpRequest({ email, type: "register" })
            toast.success("OTP sent to your email")
            setStep(2)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    // Step 2 — verify OTP
    const handleVerifyOTP = async () => {
        try {
            setLoading(true)
            await otpVerify({ email, otp, type: "register" })
            toast.success("Email verified")
            setStep(3)
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Invalid OTP")
        } finally {
            setLoading(false)
        }
    }

    // Step 3 — register
    const handleRegister = async () => {
        if (!avatarFile) {
            toast.error("Please upload a profile photo")
            return
        }
        try {
            setLoading(true)

            // backend expects multipart/form-data (upload.single("avatar"))
            const res = await register({...formData , email , avatar : avatarFile});
            if(res){
                dispatch(setUser(res.data))
                connectSocket()
                toast.success("Account created!")
                navigate("/")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background glow — signature element */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-[#4F8EF7] opacity-[0.07] blur-[120px] pointer-events-none" />

            {/* Glass card */}
            <div className="w-full max-w-md relative z-10">

                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#E8EEFF] tracking-tight">
                        wave<span className="text-[#4F8EF7]">.</span>
                    </h1>
                    <p className="text-[#8899BB] text-sm mt-1">Chat with anyone, anywhere</p>
                </div>

                <div
                    className="rounded-2xl p-8"
                    style={{
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow: "0 25px 45px rgba(0,0,0,0.3)"
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
                                    <div className={`h-px w-12 transition-all duration-300 ${step > s ? "bg-[#4F8EF7]" : "bg-white/10"}`} />
                                )}
                            </div>
                        ))}
                        <span className="ml-2 text-[#8899BB] text-xs">
                            {step === 1 && "Enter email"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Your details"}
                        </span>
                    </div>

                    {/* Step 1 — Email */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[#8899BB] text-sm mb-1.5 block">Email address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                <label className="text-[#8899BB] text-sm mb-1.5 block">Enter OTP</label>
                                <p className="text-[#8899BB] text-xs mb-3">Sent to {email}</p>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
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

                    {/* Step 3 — Details */}
                    {step === 3 && (
                        <div className="space-y-4">

                            {/* Avatar upload */}
                            <div className="flex flex-col items-center mb-2">
                                <label htmlFor="avatar-upload" className="cursor-pointer group relative">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden transition-all"
                                        style={{
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.1)"
                                        }}
                                    >
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Camera size={22} className="text-[#8899BB]" />
                                        )}
                                    </div>
                                    <div
                                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{ background: "#4F8EF7" }}
                                    >
                                        <Camera size={12} className="text-white" />
                                    </div>
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <p className="text-[#8899BB] text-xs mt-2">
                                    {avatarFile ? avatarFile.name : "Upload a profile photo"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[#8899BB] text-xs mb-1.5 block">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[#8899BB] text-xs mb-1.5 block">Username</label>
                                    <input
                                        type="text"
                                        placeholder="john_doe"
                                        value={formData.userName}
                                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[#8899BB] text-xs mb-1.5 block">Password</label>
                                <input
                                    type="password"
                                    placeholder="Min 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#E8EEFF] placeholder-[#8899BB] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[#8899BB] text-xs mb-1.5 block">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.DOB}
                                    onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[#E8EEFF] focus:outline-none focus:border-[#4F8EF7] transition-colors text-sm"
                                />
                            </div>
                            <button
                                onClick={handleRegister}
                                disabled={loading || !formData.fullName || !formData.userName || !formData.password || !formData.DOB || !avatarFile}
                                className="w-full bg-[#4F8EF7] hover:bg-[#3A7AF0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
                            >
                                {loading ? "Creating account..." : "Create account"}
                            </button>
                        </div>
                    )}

                    {/* Footer link */}
                    <p className="text-center text-[#8899BB] text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#4F8EF7] hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register