// backend/middleware/captcha.js
import fetch from "node-fetch";

/**
 * Verifica el token reCAPTCHA recibido
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función next de Express
 */
export const verifyCaptcha = async (req, res, next) => {
  try {
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

    // Obtener token del cuerpo de la solicitud
    const { recaptchaToken } = req.body;

    // Verificar que existe un token
    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: "Se requiere verificación reCAPTCHA",
      });
    }

    // Verificar que existe la clave secreta
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error("❌ No se ha configurado RECAPTCHA_SECRET_KEY");
      return res.status(500).json({
        success: false,
        message: "Error de configuración del servidor",
      });
    }

    // Preparar datos para la solicitud a Google
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
    const formData = new URLSearchParams();
    formData.append("secret", process.env.RECAPTCHA_SECRET_KEY);
    formData.append("response", recaptchaToken);
    formData.append("remoteip", req.ip);

    // Enviar solicitud a la API de Google
    const response = await fetch(verificationURL, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Procesar respuesta
    const data = await response.json();
    console.log("reCAPTCHA response:", data);

    // Verificar si la puntuación es aceptable (umbral configurable)
    const threshold = parseFloat(process.env.RECAPTCHA_THRESHOLD) || 0.5;

    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: "Error de verificación reCAPTCHA",
        errors: data["error-codes"],
      });
    }

    if (data.score < threshold) {
      console.warn(
        `⚠️ Puntuación reCAPTCHA baja: ${data.score} < ${threshold}`
      );
      return res.status(403).json({
        success: false,
        message: "Verificación de seguridad fallida",
      });
    }

    // Almacenar puntuación en la solicitud para posible uso posterior
    req.recaptchaScore = data.score;
    next();
  } catch (error) {
    console.error("Error verificando reCAPTCHA:", error);
    return res.status(500).json({
      success: false,
      message: "Error al verificar reCAPTCHA",
    });
  }
};
