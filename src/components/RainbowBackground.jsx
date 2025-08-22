// src/components/RainbowBackground.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";

export function RainbowBackground({ children, className = "" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil para optimizar el rendimiento
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Si es móvil, usar un fondo estático más simple
  if (isMobile) {
    return (
      <div
        className={`mobile-background-container ${
          isDark ? "mobile-dark-bg" : "mobile-light-bg"
        } ${className}`}
      >
        {/* Contenido que va encima del fondo */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // Generar 25 franjas rainbow solo para desktop
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
