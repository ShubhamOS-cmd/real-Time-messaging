import { UserRound } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

const people = [
    { left: "8%", top: "34%", size: 34 },
    { left: "35%", top: "16%", size: 32 },
    { left: "67%", top: "10%", size: 34 },
    { left: "53%", top: "45%", size: 36 },
    { left: "78%", top: "67%", size: 34 },
    { left: "30%", top: "55%", size: 31 },
];

const OrbitAuthLayout = ({ children }) => {
    return (
        <div className="orbit-auth-canvas relative min-h-screen flex items-center justify-center px-4 py-6">
            <ThemeToggle className="orbit-theme-toggle--floating" />

            <div
                className="
                    w-full
                    max-w-[1100px]
                    min-h-[620px]
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-orbit-line
                    bg-orbit-panel
                    shadow-[0_25px_70px_rgba(36,33,27,0.12)]
                    flex
                    flex-col
                    lg:flex-row
                "
            >

                {/* =====================================================
                    LEFT — ORBIT ART
                ====================================================== */}

                <section
                    className="
                        relative
                        w-full
                        lg:w-1/2
                        min-h-[420px]
                        lg:min-h-[620px]
                        overflow-hidden
                        bg-gradient-to-br
                        from-[#f3b82d]
                        via-[#d8780d]
                        to-[#8d3509]
                    "
                >

                    {/* Overlay */}

                    <div
                        className="
                            absolute
                            inset-0
                            pointer-events-none
                            bg-gradient-to-b
                            from-white/[0.04]
                            via-transparent
                            to-black/20
                        "
                    />

                    {/* =================================================
                        ORBIT RINGS
                    ================================================== */}

                    <div className="absolute inset-0 pointer-events-none">

                        <div
                            className="
                                absolute
                                w-[150%]
                                h-[72%]
                                -left-[28%]
                                top-[10%]
                                rounded-[50%]
                                border
                                border-black/25
                                rotate-[12deg]
                            "
                        />

                        <div
                            className="
                                absolute
                                w-[145%]
                                h-[66%]
                                -left-[23%]
                                top-[18%]
                                rounded-[50%]
                                border
                                border-black/25
                                rotate-[12deg]
                            "
                        />

                        <div
                            className="
                                absolute
                                w-[140%]
                                h-[60%]
                                -left-[18%]
                                top-[26%]
                                rounded-[50%]
                                border
                                border-black/25
                                rotate-[12deg]
                            "
                        />

                        <div
                            className="
                                absolute
                                w-[135%]
                                h-[54%]
                                -left-[13%]
                                top-[34%]
                                rounded-[50%]
                                border
                                border-black/25
                                rotate-[12deg]
                            "
                        />

                        <div
                            className="
                                absolute
                                w-[130%]
                                h-[48%]
                                -left-[8%]
                                top-[42%]
                                rounded-[50%]
                                border
                                border-black/25
                                rotate-[12deg]
                            "
                        />

                        <div
                            className="
                                absolute
                                w-[125%]
                                h-[42%]
                                -left-[3%]
                                top-[50%]
                                rounded-[50%]
                                border
                                border-black/25
                                rotate-[12deg]
                            "
                        />

                        <div
                            className="
                                absolute
                                w-[120%]
                                h-[36%]
                                left-[2%]
                                top-[58%]
                                rounded-[50%]
                                border
                                border-black/20
                                rotate-[12deg]
                            "
                        />

                    </div>

                    {/* =================================================
                        PEOPLE
                    ================================================== */}

                    {people.map((person, index) => (
                        <div
                            key={index}
                            className="
                                absolute
                                z-10
                                transition-transform
                                duration-300
                                hover:scale-110
                            "
                            style={{
                                left: person.left,
                                top: person.top,
                            }}
                        >
                            <div
                                className="
                                    relative
                                    flex
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#17130d]
                                    border-2
                                    border-white/90
                                    shadow-[0_6px_20px_rgba(0,0,0,0.3)]
                                "
                                style={{
                                    width: person.size,
                                    height: person.size,
                                }}
                            >
                                <UserRound
                                    size={person.size * 0.55}
                                    strokeWidth={2}
                                    className="text-white"
                                />

                                <span
                                    className="
                                        absolute
                                        right-[-2px]
                                        bottom-[-2px]
                                        h-3
                                        w-3
                                        rounded-full
                                        bg-[#65d36e]
                                        border-2
                                        border-[#b85b0b]
                                    "
                                />
                            </div>
                        </div>
                    ))}

                    {/* Particles */}

                    <span className="absolute left-[18%] top-[47%] h-2 w-2 rounded-full bg-white/60" />

                    <span className="absolute left-[47%] top-[29%] h-1.5 w-1.5 rounded-full bg-white/60" />

                    <span className="absolute left-[85%] top-[43%] h-2 w-2 rounded-full bg-white/50" />

                    {/* =================================================
                        BRAND
                    ================================================== */}

                    <div
                        className="
                            absolute
                            left-10
                            bottom-9
                            z-20
                            max-w-[360px]
                            text-white
                        "
                    >
                        <div className="mb-7 text-sm font-semibold tracking-wide">
                            ORBIT
                        </div>

                        <h1 className="mb-5 text-lg font-semibold">
                            Talk beyond distance.
                        </h1>

                        <p className="text-sm font-medium leading-6 text-white/90">
                            Your conversations are right where you left them.
                        </p>
                    </div>

                </section>

                {/* =====================================================
                    RIGHT — WHITE AUTH PANEL
                ====================================================== */}

                <section
                    className="
                        flex
                        w-full
                        lg:w-1/2
                        min-h-[500px]
                        lg:min-h-[620px]
                        items-center
                        justify-center
                        bg-orbit-panel
                        px-7
                        py-12
                        sm:px-10
                        lg:px-14
                    "
                >
                    <div className="w-full max-w-[430px]">
                        {children}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default OrbitAuthLayout;