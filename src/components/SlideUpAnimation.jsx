// src/components/SlideUpAnimation.jsx
import { useEffect, useRef } from "react";

export function SlideUpAnimation({ children, delay = 0, className = "" }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Configuración inicial
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";

    // Función para animar
    const animate = () => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    };

    // Aplicar animación después del retraso
    const timeoutId = setTimeout(animate, delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

export default SlideUpAnimation;
