// src/components/ReCaptcha.jsx
import React, { useEffect, useRef } from "react";

/**
 * Componente que integra Google reCAPTCHA v3 en la aplicación
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onVerify - Función que recibe el token cuando se verifica
 * @param {string} props.action - Acción para el seguimiento en reCAPTCHA
 */
const ReCaptcha = ({ onVerify, action = "submit" }) => {
  const recaptchaRef = useRef(null);
  const scriptLoaded = useRef(false);

  // Cargar el script de reCAPTCHA
  useEffect(() => {
    // Evitar cargar el script múltiples veces
    if (scriptLoaded.current || typeof window === "undefined") return;

    // Para desarrollo, podemos simular el token
    if (
      process.env.NODE_ENV === "development" &&
      process.env.REACT_APP_SKIP_CAPTCHA_IN_DEV === "true"
    ) {
      console.log("Simulando reCAPTCHA en entorno de desarrollo");
      setTimeout(() => {
        if (onVerify) onVerify("simulated-recaptcha-token-for-development");
      }, 500);
      return;
    }

    // Clave del sitio de recaptcha
    const siteKey =
      process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
      "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Clave de prueba

    // Crear el elemento script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    // Manejar la carga del script
    script.onload = () => {
      scriptLoaded.current = true;
      console.log("reCAPTCHA script cargado");

      // Guardar referencia a la API de grecaptcha
      recaptchaRef.current = window.grecaptcha;

      // Ejecutar verificación inicial en silencio
      executeRecaptcha();
    };

    // Manejar errores del script
    script.onerror = () => {
      console.error("Error al cargar el script de reCAPTCHA");
    };

    // Añadir script al DOM
    document.head.appendChild(script);

    // Limpiar cuando el componente se desmonte
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [onVerify]);

  // Función para ejecutar la verificación de reCAPTCHA
  const executeRecaptcha = async () => {
    if (!recaptchaRef.current || !scriptLoaded.current) return;

    try {
      const siteKey =
        process.env.REACT_APP_RECAPTCHA_SITE_KEY ||
        "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Clave de prueba

      await recaptchaRef.current.ready(() => {
        console.log("reCAPTCHA está listo");

        recaptchaRef.current
          .execute(siteKey, { action })
          .then((token) => {
            console.log("Token reCAPTCHA generado");
            if (onVerify) onVerify(token);
          })
          .catch((error) => {
            console.error("Error en ejecución de reCAPTCHA:", error);
          });
      });
    } catch (error) {
      console.error("Error al ejecutar reCAPTCHA:", error);
    }
  };

  // Para permitir reinicios manuales si es necesario
  const refreshToken = () => {
    executeRecaptcha();
  };

  // Componente invisible - no renderiza nada visible
  return (
    <div id="recaptcha-container" className="hidden">
      {/* El badge de reCAPTCHA v3 aparecerá automáticamente en la esquina */}
    </div>
  );
};

export default ReCaptcha;
