// src/components/AnimatedBackground.jsx
import { useState, useEffect, useRef } from "react";

const bkgColors = [
  [26, 56, 82], // Azul oscuro
  [178, 160, 248], // Purpura claro
  [25, 33, 44], // Casi negro
  [52, 34, 61], // Morado oscuro
  [71, 194, 235], // Azul claro
  [230, 191, 0], // Amarillo
  [37, 110, 143], // Azul medio
];

export function AnimatedBackground({ children, className = "" }) {
  const [colorIndices, setColorIndices] = useState([0, 1, 2, 3]);
  const [step, setStep] = useState(0);
  const animationRef = useRef(null);
  const ANIMATION_SPEED = 0.01;
  const INTERVAL = 20; // ms

  const calculateGradient = () => {
    const color_1_start = bkgColors[colorIndices[0]];
    const color_1_end = bkgColors[colorIndices[1]];
    const color_2_start = bkgColors[colorIndices[2]];
    const color_2_end = bkgColors[colorIndices[3]];

    const stepIndex = 1 - step;

    const r1 = Math.round(stepIndex * color_1_start[0] + step * color_1_end[0]);
    const g1 = Math.round(stepIndex * color_1_start[1] + step * color_1_end[1]);
    const b1 = Math.round(stepIndex * color_1_start[2] + step * color_1_end[2]);
    const color_1 = `rgb(${r1}, ${g1}, ${b1})`;

    const r2 = Math.round(stepIndex * color_2_start[0] + step * color_2_end[0]);
    const g2 = Math.round(stepIndex * color_2_start[1] + step * color_2_end[1]);
    const b2 = Math.round(stepIndex * color_2_start[2] + step * color_2_end[2]);
    const color_2 = `rgb(${r2}, ${g2}, ${b2})`;

    return `linear-gradient(155deg, ${color_1}, ${color_2})`;
  };

  const updateAnimation = () => {
    setStep((prevStep) => {
      let newStep = prevStep + ANIMATION_SPEED;

      if (newStep >= 1) {
        newStep %= 1;
        setColorIndices((prevIndices) => {
          const newIndices = [...prevIndices];
          // Actualizar índices de color
          newIndices[0] = newIndices[1];
          newIndices[2] = newIndices[3];

          // Seleccionar nuevos colores aleatorios
          newIndices[1] =
            (newIndices[1] +
              Math.floor(1 + Math.random() * (bkgColors.length - 1))) %
            bkgColors.length;
          newIndices[3] =
            (newIndices[3] +
              Math.floor(1 + Math.random() * (bkgColors.length - 1))) %
            bkgColors.length;

          return newIndices;
        });
      }

      return newStep;
    });
  };

  useEffect(() => {
    // Iniciar la animación
    animationRef.current = setInterval(updateAnimation, INTERVAL);

    // Limpiar intervalo cuando el componente se desmonte
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Calcular el gradiente actual
  const gradientStyle = {
    background: calculateGradient(),
  };

  return (
    <div className={`w-full min-h-screen ${className}`} style={gradientStyle}>
      {children}
    </div>
  );
}

export default AnimatedBackground;
