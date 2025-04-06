// middleware/verifyRecaptcha.js

import fetch from "node-fetch";

/**
 * Middleware para verificar el token de reCAPTCHA
 * @param {Object} req - Solicitud Express
 * @param {Object} res - Respuesta Express
 * @param {Function} next - Función next de Express
 */
export async function verifyRecaptcha(req, res, next) {
  // Configurar CORS para las respuestas
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Manejar solicitudes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Omitir verificación en desarrollo si está configurado así
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.SKIP_CAPTCHA_IN_DEV === "true"
  ) {
    console.log(
      "⚠️ Omitiendo verificación de CAPTCHA en entorno de desarrollo"
    );
    return next();
  }

  // Verificar si CAPTCHA está deshabilitado globalmente
  if (process.env.DISABLE_CAPTCHA === "true") {
    console.log("⚠️ Verificación de CAPTCHA deshabilitada globalmente");
    return next();
  }

  // Obtener el token del cuerpo de la solicitud
  const { recaptchaToken } = req.body;

  // Si no hay token, enviar error
  if (!recaptchaToken) {
    return res.status(400).json({
      success: false,
      message: "Se requiere verificación reCAPTCHA",
    });
  }

  // Si el token es simulado (para desarrollo o fallbacks), aceptar pero advertir
  if (
    recaptchaToken.startsWith("simulated-") ||
    recaptchaToken.startsWith("fallback-")
  ) {
    console.warn(`⚠️ Usando token de reCAPTCHA simulado: ${recaptchaToken}`);
    return next();
  }

  try {
    // Usar la clave secreta para verificar el token con Google
    const secretKey = "6LdRPQwrAAAAAH7oP4oD32y6lPUhIx1jUb-DEykb";

    // Construir la URL para la API de verificación
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify";

    // Preparar los datos para enviar
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", recaptchaToken);
    if (req.ip) formData.append("remoteip", req.ip); // IP opcional pero recomendada

    // Realizar la solicitud a Google para verificar
    const response = await fetch(verificationURL, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Analizar la respuesta
    const data = await response.json();

    // Log para depuración
    console.log(
      "Respuesta de verificación reCAPTCHA:",
      JSON.stringify(data, null, 2)
    );

    // Comprobar si la verificación fue exitosa
    if (!data.success) {
      console.error("Error de reCAPTCHA:", data["error-codes"]);
      return res.status(400).json({
        success: false,
        message: "Verificación de reCAPTCHA fallida",
        errors: data["error-codes"],
      });
    }

    // Verificar la puntuación (para reCAPTCHA v3)
    // 1.0 es muy probablemente humano, 0.0 es muy probablemente un bot
    const threshold = parseFloat(process.env.RECAPTCHA_THRESHOLD) || 0.5; // Ajusta este umbral según tus necesidades

    if (data.score < threshold) {
      console.warn(
        `⚠️ Puntuación de reCAPTCHA baja: ${data.score} < ${threshold}`
      );

      // En entorno de desarrollo o con características experimentales, permitir continuar
      if (
        process.env.NODE_ENV !== "production" ||
        process.env.ALLOW_LOW_SCORE === "true"
      ) {
        console.warn(
          "⚠️ Permitiendo acceso a pesar de puntuación baja (desarrollo o características experimentales)"
        );
        req.recaptchaData = data;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "La verificación de seguridad no alcanzó el umbral mínimo",
        score: data.score,
        requiredScore: threshold,
      });
    }

    // Si todo está bien, continuar con la solicitud
    req.recaptchaData = data; // Guardar los datos para uso posterior
    next();
  } catch (error) {
    console.error("Error al verificar reCAPTCHA:", error);

    // En desarrollo, permitir continuar a pesar del error
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "⚠️ Permitiendo acceso a pesar del error en verificación (entorno de desarrollo)"
      );
      return next();
    }

    return res.status(500).json({
      success: false,
      message: "Error al procesar la verificación de seguridad",
    });
  }
}

export default verifyRecaptcha;
