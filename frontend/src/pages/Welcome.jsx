import { Link } from "react-router";
import ThemeToggle from "../components/ThemeToggle.jsx";

const Welcome = () => {
  return (
    <div className="orbit-welcome-page relative min-h-screen overflow-hidden bg-orbit-bg text-orbit-text">
      <ThemeToggle className="orbit-theme-toggle--floating" />
      {/* -------------------------------- */}
      {/* Background grid */}
      {/* -------------------------------- */}

      <div
        className="
          absolute inset-0
          opacity-[0.35]
          pointer-events-none
        "
        style={{
          backgroundImage: `
            linear-gradient(#B98212 1px, transparent 1px),
            linear-gradient(90deg, #B98212 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 0%, transparent 75%)",
        }}
      />

      {/* -------------------------------- */}
      {/* Dotted background */}
      {/* -------------------------------- */}

      <div
        className="
          absolute inset-0
          opacity-[0.35]
          pointer-events-none
        "
        style={{
          backgroundImage:
            "radial-gradient(#B98212 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 0%, transparent 65%)",
        }}
      />

      {/* -------------------------------- */}
      {/* Orbital rings */}
      {/* -------------------------------- */}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="
            absolute
            h-[420px] w-[820px]
            rounded-[50%]
            border border-[#B98212]/20
            rotate-[-18deg]
          "
        />

        <div
          className="
            absolute
            h-[600px] w-[1000px]
            rounded-[50%]
            border border-[#B98212]/15
            rotate-[22deg]
          "
        />

        <div
          className="
            absolute
            h-[780px] w-[1200px]
            rounded-[50%]
            border border-[#B98212]/10
            rotate-[-8deg]
          "
        />

        <div
          className="
            absolute
            h-[260px] w-[600px]
            rounded-[50%]
            border border-[#D8780D]/15
            rotate-[55deg]
          "
        />
      </div>

      {/* -------------------------------- */}
      {/* Orbit nodes */}
      {/* -------------------------------- */}

      <div className="absolute left-[18%] top-[28%] h-2.5 w-2.5 rounded-full bg-[#B98212] shadow-[0_0_18px_rgba(185,130,18,0.45)]" />

      <div className="absolute right-[20%] top-[25%] h-2 w-2 rounded-full bg-[#D8780D] shadow-[0_0_15px_rgba(216,120,13,0.4)]" />

      <div className="absolute bottom-[25%] left-[23%] h-2 w-2 rounded-full bg-[#B98212]" />

      <div className="absolute bottom-[20%] right-[26%] h-3 w-3 rounded-full bg-[#C9941A] shadow-[0_0_18px_rgba(201,148,26,0.4)]" />

      {/* -------------------------------- */}
      {/* Main content */}
      {/* -------------------------------- */}

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl text-center">

          {/* ORBIT mark */}

          <div className="mb-8 flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* outer orbit */}
              <div
                className="
                  absolute inset-0
                  rounded-full
                  border-2 border-[#B98212]
                  rotate-[-25deg]
                  scale-x-[1.7]
                "
              />

              {/* second orbit */}
              <div
                className="
                  absolute inset-0
                  rounded-full
                  border border-[#D8780D]/50
                  rotate-[55deg]
                  scale-x-[1.7]
                "
              />

              {/* center */}
              <div className="h-4 w-4 rounded-full bg-[#B98212] shadow-[0_0_25px_rgba(185,130,18,0.5)]" />
            </div>
          </div>

          {/* Brand */}

          <div className="mb-5 text-sm font-bold uppercase tracking-[0.45em] text-orbit-primary">
            ORBIT
          </div>

          {/* Heading */}

          <h1 className="text-5xl font-bold tracking-[-0.04em] text-orbit-text sm:text-6xl md:text-7xl">
            Talk beyond
            <span className="block text-orbit-primary">
              distance.
            </span>
          </h1>

          {/* Description */}

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-orbit-muted sm:text-lg">
            Messages move in real time and wait safely when
            someone is offline.
          </p>

          {/* Actions */}

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="orbit-button rounded-xl px-7 py-3.5 text-sm transition-all duration-200"
            >
              Create account
            </Link>

            <Link
              to="/login"
              className="
                rounded-xl
                border border-orbit-line
                bg-orbit-surface
                px-7 py-3.5
                text-sm font-semibold
                text-orbit-text
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-orbit-primary
                hover:bg-orbit-raised
                hover:text-orbit-primary
                active:translate-y-0
              "
            >
              Sign in
            </Link>
          </div>

          {/* Small bottom statement */}

          <p className="mt-10 text-xs tracking-wide text-orbit-muted">
            Connect · Communicate · Stay close
          </p>
        </div>
      </main>
    </div>
  );
};

export default Welcome;