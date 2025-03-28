// src/components/AnimateOnScroll.jsx
import React from "react";
import { cn } from "@/lib/utils";

/**
 * Componente que aplica animaciones basadas en scroll a sus hijos
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elementos hijos a animar
 * @param {string} props.className - Clases adicionales para el contenedor
 * @param {'fade' | 'slide-up' | 'slide-right' | 'scale' | 'clip'} props.animation - Tipo de animación
 * @param {string} props.entryPoint - Punto de entrada (0% por defecto)
 * @param {string} props.coverPoint - Punto de cobertura (40% por defecto)
 * @param {string} props.delay - Retraso en ms para cada elemento hijo
 * @param {boolean} props.staggered - Si los hijos deben animarse con retraso secuencial
 */
export function AnimateOnScroll({
  children,
  className,
  animation = "fade",
  entryPoint = "0%",
  coverPoint = "40%",
  delay = "0",
  staggered = false,
}) {
  // Verificar si el navegador soporta animation-timeline
  const [supportsScrollTimeline, setSupportsScrollTimeline] =
    React.useState(false);

  React.useEffect(() => {
    // Detecta si el navegador soporta animation-timeline
    const supportsScrollTimeline = CSS.supports("animation-timeline: view()");
    setSupportsScrollTimeline(supportsScrollTimeline);

    // Si no soporta animation-timeline, usamos un fallback con Intersection Observer
    if (!supportsScrollTimeline && React.Children.count(children) > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      // Seleccionamos todos los elementos con la clase .animate-on-scroll-item
      document.querySelectorAll(".animate-on-scroll-item").forEach((item) => {
        observer.observe(item);
      });

      return () => observer.disconnect();
    }
  }, [children]);

  // Estilos base para el contenedor
  const containerClasses = cn("animate-on-scroll-container", className);

  // Genera estilos CSS dinámicos para inyectar las reglas de animación
  const generateStyles = () => {
    let animationCSS = "";

    // Definir diferentes tipos de animaciones
    const animations = {
      fade: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `,
      "slide-up": `
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `,
      "slide-right": `
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `,
      scale: `
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `,
      clip: `
        @keyframes clipReveal {
          from {
            opacity: 0;
            clip-path: inset(100% 100% 0 0);
          }
          to {
            opacity: 1;
            clip-path: inset(0 0 0 0);
          }
        }
      `,
    };

    // Añadir la animación seleccionada
    animationCSS += animations[animation] || animations.fade;

    // Añadir reglas para elementos con soporte de animation-timeline
    animationCSS += `
      .animate-on-scroll-item {
        animation-name: ${
          animation === "clip"
            ? "clipReveal"
            : animation === "slide-up"
            ? "slideUp"
            : animation === "slide-right"
            ? "slideRight"
            : animation === "scale"
            ? "scaleIn"
            : "fadeIn"
        };
        animation-duration: 0.8s;
        animation-fill-mode: both;
        animation-timing-function: ease-out;
        
        /* Propiedades de scroll-driven animation */
        animation-timeline: view();
        animation-range: entry ${entryPoint} cover ${coverPoint};
      }
    `;

    // Añadir reglas para fallback (navegadores sin soporte)
    animationCSS += `
      .animate-on-scroll-item:not(.animate-in) {
        opacity: 0;
      }
      
      .animate-on-scroll-item.animate-in {
        animation: ${
          animation === "clip"
            ? "clipReveal"
            : animation === "slide-up"
            ? "slideUp"
            : animation === "slide-right"
            ? "slideRight"
            : animation === "scale"
            ? "scaleIn"
            : "fadeIn"
        } 0.8s ease-out forwards;
      }
    `;

    // Añadir retrasos si se solicita efecto escalonado
    if (staggered) {
      animationCSS += `
        .animate-on-scroll-item:nth-child(1) { animation-delay: ${delay}ms; }
        .animate-on-scroll-item:nth-child(2) { animation-delay: ${
          parseInt(delay) + 100
        }ms; }
        .animate-on-scroll-item:nth-child(3) { animation-delay: ${
          parseInt(delay) + 200
        }ms; }
        .animate-on-scroll-item:nth-child(4) { animation-delay: ${
          parseInt(delay) + 300
        }ms; }
        .animate-on-scroll-item:nth-child(5) { animation-delay: ${
          parseInt(delay) + 400
        }ms; }
        .animate-on-scroll-item:nth-child(6) { animation-delay: ${
          parseInt(delay) + 500
        }ms; }
        .animate-on-scroll-item:nth-child(7) { animation-delay: ${
          parseInt(delay) + 600
        }ms; }
        .animate-on-scroll-item:nth-child(8) { animation-delay: ${
          parseInt(delay) + 700
        }ms; }
        .animate-on-scroll-item:nth-child(9) { animation-delay: ${
          parseInt(delay) + 800
        }ms; }
        .animate-on-scroll-item:nth-child(10) { animation-delay: ${
          parseInt(delay) + 900
        }ms; }
      `;
    } else if (delay !== "0") {
      animationCSS += `
        .animate-on-scroll-item {
          animation-delay: ${delay}ms;
        }
      `;
    }

    return animationCSS;
  };

  return (
    <div className={containerClasses}>
      <style>{generateStyles()}</style>
      {React.Children.map(children, (child, index) => {
        // Si es un elemento React válido, añadir la clase para animación
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className: cn("animate-on-scroll-item", child.props.className),
            key: index,
          });
        }
        return child;
      })}
    </div>
  );
}

export default AnimateOnScroll;
