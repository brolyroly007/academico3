// src/components/ReCaptcha.jsx
import React, { useEffect, useRef, useState } from "react";

/**
 * Componente que integra Google reCAPTCHA v3 en la aplicación
 * Con la clave del sitio correctamente configurada
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onVerify - Función que recibe el token cuando se verifica
 * @param {string} props.action - Acción para el seguimiento en reCAPTCHA
 */
const ReCaptcha = ({ onVerify, action = "submit" }) => {
  const recaptchaRef = useRef(null);
  const scriptLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Cargar el script de reCAPTCHA
  useEffect(() => {
    // Evitar cargar el script múltiples veces
    if (scriptLoaded.current || typeof window === "undefined") return;

    setIsLoading(true);

    // Comprobar si estamos en desarrollo para posiblemente simular la verificación
    if (
      process.env.NODE_ENV === "development" &&
      process.env.REACT_APP_SKIP_CAPTCHA_IN_DEV === "true"
    ) {
      console.log("Simulando reCAPTCHA en entorno de desarrollo");
      setTimeout(() => {
        if (onVerify) {
          onVerify("simulated-recaptcha-token-for-development");
          setIsLoading(false);
        }
      }, 1000);
      return;
    }

    // Clave del sitio de reCAPTCHA REAL
    const siteKey = "6LdRPQwrAAAAAAWWw41UxSFgKYADcOVJJHQjypcc";

    try {
      // Crear el elemento script
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      // Manejar la carga del script
      script.onload = () => {
        scriptLoaded.current = true;
        console.log("reCAPTCHA script cargado correctamente");

        // Guardar referencia a la API de grecaptcha
        recaptchaRef.current = window.grecaptcha;

        // Ejecutar verificación inicial
        executeRecaptcha();
      };

      // Manejar errores del script
      script.onerror = (error) => {
        console.error("Error al cargar el script de reCAPTCHA:", error);
        setIsError(true);
        setIsLoading(false);

        // Proporcionar un token simulado en caso de error para evitar bloquear el flujo
        if (onVerify) {
          onVerify("fallback-token-due-to-recaptcha-error");
        }
      };

      // Añadir script al DOM
      document.head.appendChild(script);

      // Limpiar cuando el componente se desmonte
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } catch (e) {
      console.error("Error al configurar reCAPTCHA:", e);
      setIsError(true);
      setIsLoading(false);

      // Proporcionar un token simulado en caso de error para evitar bloquear el flujo
      if (onVerify) {
        onVerify("fallback-token-due-to-recaptcha-error");
      }
    }
  }, [onVerify, action]);

  // Función para ejecutar la verificación de reCAPTCHA
  const executeRecaptcha = async () => {
    if (!recaptchaRef.current || !scriptLoaded.current) return;

    try {
      const siteKey = "6LdRPQwrAAAAAAWWw41UxSFgKYADcOVJJHQjypcc";

      // Esperar a que reCAPTCHA esté listo
      await recaptchaRef.current.ready(() => {
        console.log("reCAPTCHA está listo para ejecutar verificación");

        // Ejecutar reCAPTCHA
        recaptchaRef.current
          .execute(siteKey, { action })
          .then((token) => {
            console.log("Token reCAPTCHA generado con éxito");
            setIsLoading(false);
            setIsError(false);
            if (onVerify) onVerify(token);
          })
          .catch((error) => {
            console.error("Error en ejecución de reCAPTCHA:", error);
            setIsError(true);
            setIsLoading(false);

            // Proporcionar un token simulado en caso de error
            if (onVerify) {
              onVerify("fallback-token-due-to-recaptcha-execution-error");
            }
          });
      });
    } catch (error) {
      console.error("Error al ejecutar reCAPTCHA:", error);
      setIsError(true);
      setIsLoading(false);

      // Proporcionar un token simulado en caso de error
      if (onVerify) {
        onVerify("fallback-token-due-to-recaptcha-execution-error");
      }
    }
  };

  // Para permitir reinicios manuales si es necesario
  const refreshToken = () => {
    setIsLoading(true);
    setIsError(false);
    executeRecaptcha();
  };

  // Componente invisible - no renderiza nada visible
  return (
    <div id="recaptcha-container" className="hidden">
      {isLoading && (
        <input type="hidden" name="recaptcha_loading" value="true" />
      )}
      {isError && <input type="hidden" name="recaptcha_error" value="true" />}
      {/* El badge de reCAPTCHA v3 aparecerá automáticamente en la esquina */}
    </div>
  );
};

export default ReCaptcha;
