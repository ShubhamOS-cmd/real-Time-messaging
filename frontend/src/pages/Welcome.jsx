import { Link } from "react-router"

const Welcome = () => {
    return (
        <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background orbs */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#4F8EF7] opacity-[0.06] blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#4F8EF7] opacity-[0.04] blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center max-w-lg">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#4F8EF7" strokeWidth="1.5" />
                            <circle cx="12" cy="12" r="4" fill="#4F8EF7" />
                            <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#4F8EF7" strokeWidth="1.5" opacity="0.4" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-[#E8EEFF] tracking-tight">
                        orbit<span className="text-[#4F8EF7]">chat</span>
                    </h1>
                </div>

                {/* Tagline */}
                <p className="text-[#8899BB] text-lg mb-2">
                    Connect with anyone, anywhere.
                </p>
                <p className="text-[#8899BB]/60 text-sm mb-12">
                    Real-time messaging, built for the modern web.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/register"
                        className="px-8 py-3.5 bg-[#4F8EF7] hover:bg-[#3A7AF0] text-white font-medium rounded-xl transition-colors text-sm"
                    >
                        Get started
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-3.5 text-[#E8EEFF] font-medium rounded-xl transition-colors text-sm"
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)"
                        }}
                    >
                        Sign in
                    </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-4 mt-16">
                    {[
                        { label: "Real-time", desc: "Instant delivery" },
                        { label: "Secure", desc: "End-to-end safe" },
                        { label: "Simple", desc: "Clean interface" },
                    ].map((f) => (
                        <div key={f.label}
                            className="rounded-xl p-4"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)"
                            }}
                        >
                            <p className="text-[#E8EEFF] text-sm font-medium">{f.label}</p>
                            <p className="text-[#8899BB] text-xs mt-0.5">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Welcome