import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-[8px] flex items-center justify-center transition-colors duration-200"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 rounded-[8px] flex items-center justify-center bg-transparent border border-border hover:bg-muted transition-colors duration-200"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]" />
      ) : (
        <Moon className="w-5 h-5 text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]" />
      )}
    </button>
  );
};
