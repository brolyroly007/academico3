// src/components/RainbowBackground.jsx
import React from "react";
import { useTheme } from "./theme-provider";

export function RainbowBackground({ children, className = "" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Generar 25 franjas rainbow
  const rainbowStripes = Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <div
      className={`rainbow-background-container ${
        isDark ? "dark-rainbow" : "light-rainbow"
      } ${className}`}
    >
      {/* Contenedor de las franjas rainbow */}
      <div className="absolute inset-0">
        {rainbowStripes.map((i) => (
          <div
            key={i}
            className="rainbow-stripe"
            style={{
              animationDelay: `${-i * 1.8}s`, // 45s / 25 elementos = 1.8s por elemento
            }}
          />
        ))}

        {/* Máscaras de gradiente */}
        <div className="rainbow-mask-h" />
        <div className="rainbow-mask-v" />
      </div>

      {/* Contenido que va encima del fondo */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default RainbowBackground;
