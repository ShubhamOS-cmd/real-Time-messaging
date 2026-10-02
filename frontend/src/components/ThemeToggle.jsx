import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ className = "" }) => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.dataset.theme === "dark"
  );

  useLayoutEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("orbit-theme", theme);
  }, [isDark]);

  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      className={`orbit-theme-toggle ${className}`.trim()}
      onClick={() => setIsDark((current) => !current)}
      aria-label={`Switch to ${label.toLowerCase()}`}
      aria-pressed={isDark}
      title={label}
    >
      <Icon aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
};

export default ThemeToggle;
