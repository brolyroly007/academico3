// src/components/theme-toggle.jsx
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div
      className="w-[60px] h-[30px] flex items-center rounded-full cursor-pointer transition-all duration-500 ease-in-out shadow-sm hover:shadow-md"
      onClick={handleToggle}
      style={{
        backgroundColor: isDark ? "white" : "#DFDEDE"
      }}
      aria-label="Cambiar tema"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <div
        className="w-[40%] h-[80%] rounded-full flex justify-center items-center relative overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          transform: isDark ? "translateX(150%)" : "translateX(10%)",
          backgroundColor: isDark ? "#2C2C2E" : "white"
        }}
      >
        {/* Sun Icon */}
        <Sun
          className={`absolute text-yellow-500 transition-all duration-500 ease-in-out ${
            isDark
              ? "opacity-0 rotate-180 scale-0"
              : "opacity-100 rotate-0 scale-100"
          }`}
          size={14}
        />
        
        {/* Moon Icon */}
        <Moon
          className={`absolute text-slate-200 transition-all duration-500 ease-in-out ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-180 scale-0"
          }`}
          size={14}
        />
      </div>
    </div>
  );
}

export default ThemeToggle;
