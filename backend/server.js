import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
import morgan from "morgan";
import fetch from "node-fetch";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import xss from "xss-clean";
import hpp from "hpp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
import morgan from "morgan";
import fetch from "node-fetch";
import { verifyRecaptcha } from "./middleware/recaptcha-middleware.js";
import { verifyRecaptcha } from "./middleware/recaptcha-middleware.js";



// Configurar __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Directorio para logs
const logDir = process.env.LOG_DIR || path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Stream para logs de acceso
const accessLogStream = fs.createWriteStream(path.join(logDir, "access.log"), {
  flags: "a",
});

// Middleware de logging
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev")); // Logging en consola para desarrollo

// Verificar credenciales requeridas
const requiredEnvVars = ["GOOGLE_SHEETS_ID", "CLAUDE_API_KEY"];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  console.error(`⚠️ Faltan variables de entorno: ${missingVars.join(", ")}`);
  process.exit(1);
}

// Función para enmascarar API keys en logs
const maskApiKey = (apiKey) => {
  if (!apiKey) return "undefined-key";
  if (apiKey.length < 8) return "****";
  return apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length - 4);
};

// Configurar rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos por defecto
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 solicitudes por IP por ventana
  standardHeaders: process.env.RATE_LIMIT_STANDARDIZE === "true", // Headers estándar
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde.",
  },
});

// Speed limiter - ralentización progresiva
const speedLimiter = slowDown({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  delayAfter: parseInt(process.env.RATE_LIMIT_MAX) / 2 || 50,
  delayMs: (hits) => hits * 100, // Incremento de 100ms por cada solicitud sobre el límite
});

// Middleware de seguridad
app.use(helmet()); // Headers de seguridad
app.use(xss()); // Previene XSS attacks
app.use(hpp()); // Previene HTTP Parameter Pollution

// Limitar tamaño de payload
app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true, limit: "500kb" }));

// Configurar CORS con dominios permitidos
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes sin origin (como apps móviles o curl)
      if (!origin) return callback(null, true);

      // En desarrollo, permitir localhost
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // En producción, verificar contra lista de dominios permitidos
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Aplicar rate limiting y speed limiting a todas las rutas
app.use(limiter);
app.use(speedLimiter);

// Middleware para verificar reCAPTCHA
// Importamos el módulo solo si está habilitado en la configuración
const verifyCaptcha = async (req, res, next) => {
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

    // Verificar si CAPTCHA está deshabilitado globalmente
    if (process.env.DISABLE_CAPTCHA === "true") {
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
      // En este caso, permitimos la solicitud pero registramos el error
      console.error(
        "⚠️ Continuando sin verificación de CAPTCHA debido a configuración faltante"
      );
      return next();
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
    // Si hay un error en la verificación, permitimos la solicitud pero registramos el error
    console.error(
      "⚠️ Continuando sin verificación completa de CAPTCHA debido a error:",
      error.message
    );
    next();
  }
};

// Middleware para verificar aceptación de política de privacidad
const verifyPrivacyAcceptance = (req, res, next) => {
  // Omitir verificación en desarrollo si está configurado así
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.SKIP_PRIVACY_CHECK_IN_DEV === "true"
  ) {
    return next();
  }

  if (!req.body.privacyAccepted) {
    return res.status(400).json({
      error: "Debes aceptar nuestra política de privacidad para continuar",
    });
  }
  next();
};

// Log de inicio seguro (sin mostrar credenciales completas)
console.log(
  `Usando API Key de Claude: ${maskApiKey(process.env.CLAUDE_API_KEY)}`
);
console.log(
  `Usando Google Sheets ID: ${maskApiKey(process.env.GOOGLE_SHEETS_ID)}`
);

/**
 * Calcula la cantidad de secciones y subsecciones basado en la longitud del documento
 * Esta función emula la lógica de content_generator.py
 */
function calcularEstructura(length) {
  // Extraer el número máximo de páginas del rango
  const maxPages = parseInt(length.split("-")[1]);

  return {
    numMainSections: Math.max(3, Math.min(15, Math.floor(maxPages / 4))),
    numLevel2Subsections: Math.max(2, Math.min(6, Math.floor(maxPages / 8))),
    numLevel3Subsections: Math.max(1, Math.min(4, Math.floor(maxPages / 12))),
    numLevel4Subsections: Math.max(1, Math.min(3, Math.floor(maxPages / 16))),
  };
}

/**
 * Genera un prompt para Claude basado en la estructura seleccionada y longitud
 */
function getPromptForStructure(
  indexStructure,
  documentType,
  topic,
  length,
  additionalInfo
) {
  // Calcular estructura basada en la longitud
  const {
    numMainSections,
    numLevel2Subsections,
    numLevel3Subsections,
    numLevel4Subsections,
  } = calcularEstructura(length);

  // Manejo especial para ensayos
  if (documentType.toLowerCase() === "ensayo") {
    // Determinar el número de subtemas basado en la longitud
    const maxPages = parseInt(length.split("-")[1]);
    let numSubtemas = 3; // Valor por defecto

    if (maxPages <= 2) {
      numSubtemas = 2;
    } else if (maxPages <= 5) {
      numSubtemas = 3;
    } else if (maxPages <= 12) {
      numSubtemas = 4;
    } else {
      numSubtemas = 5;
    }

    return `Genera un índice para un ensayo académico sobre "${topic}".
    
I. INTRODUCCIÓN
   1.1 Planteamiento del tema
   1.2 Relevancia y contexto
   1.3 Tesis o argumento principal

II. DESARROLLO
   (Incluir exactamente ${numSubtemas} subtemas relevantes y específicos al tema)

III. CONCLUSIÓN
   3.1 Recapitulación de puntos principales
   3.2 Síntesis del argumento global
   3.3 Reflexiones finales y proyecciones

IV. REFERENCIAS BIBLIOGRÁFICAS

INSTRUCCIONES:
- El documento será de ${length} páginas.
- Adapta los subtemas para que sean específicos y relevantes al tema "${topic}".
- NO incluyas subtítulos genéricos como "Subtema 1", sino temas concretos.
- Los subtemas de desarrollo NO deben llevar numeración.
- Formato exacto para los subtemas: "      [Subtema específico]", con 6 espacios al inicio.
- SOLAMENTE la sección "II. DESARROLLO" debe contener subtemas.
- Mantén EXACTAMENTE la estructura y formato indicados arriba.

${
  additionalInfo ? `Información adicional a considerar: ${additionalInfo}` : ""
}`;
  }

  // Para otros tipos de documentos, usar la estructura apropiada
  const basePrompt = `Genera un índice detallado para un ${documentType} de ${length} páginas sobre el tema "${topic}".

El índice debe seguir la siguiente estructura:
- Aproximadamente ${numMainSections} secciones principales (nivel 1) ${
    indexStructure === "estandar"
      ? "numeradas en ARÁBIGO (1, 2, 3...)"
      : "en ROMANO (I, II, III...)"
  }
- Cada sección principal debe tener ${numLevel2Subsections}-${
    numLevel2Subsections + 1
  } subsecciones de nivel 2 EN ARÁBICO
- Algunas subsecciones de nivel 2 deben tener ${numLevel3Subsections}-${
    numLevel3Subsections + 1
  } subsecciones de nivel 3 EN ARÁBICO
- Ocasionalmente, incluye ${numLevel4Subsections} subsecciones de nivel 4 donde sea apropiado`;

  // Añadir la estructura específica según el tipo
  let structureExample = "";

  if (indexStructure === "academica") {
    structureExample = `
IMPORTANTE: El índice DEBE seguir EXACTAMENTE esta estructura:
I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación

II. OBJETIVOS
   2.1 Objetivo general
   2.2 Objetivos específicos

III. MARCO TEÓRICO
    3.1 Antecedentes
    3.2 Bases teóricas

IV. METODOLOGÍA
    4.1 Tipo de investigación
    4.2 Técnicas e instrumentos

V. RESULTADOS Y DISCUSIÓN
   5.1 Presentación de resultados
   5.2 Análisis de hallazgos

VI. CONCLUSIONES
    6.1 Conclusiones
    6.2 Recomendaciones

VII. REFERENCIAS BIBLIOGRÁFICAS`;
  } else if (indexStructure === "capitulos") {
    structureExample = `
IMPORTANTE: El índice DEBE seguir EXACTAMENTE esta estructura:
CAPITULO I: [NOMBRE RELACIONADO A INTRODUCCIÓN]
1.1 [Subtemas]
1.2 [Subtemas]

CAPITULO II: [NOMBRE RELACIONADO A DESARROLLO]
2.1 [Subtemas]
2.2 [Subtemas]

CAPITULO III: [NOMBRE RELACIONADO A ANÁLISIS]
3.1 [Subtemas]
3.2 [Subtemas]

CAPITULO IV: [NOMBRE RELACIONADO A CONCLUSIONES]
4.1 [Subtemas]
4.2 [Subtemas]

Referencias bibliográficas`;
  } else {
    // estandar u otro
    structureExample = `
IMPORTANTE: El índice DEBE seguir EXACTAMENTE esta estructura:
1. INTRODUCCIÓN
   1.1 [Subtemas]
   1.2 [Subtemas]
   
2. DESARROLLO
   2.1 [Subtemas]
   2.2 [Subtemas]
   
3. CONCLUSIONES
   3.1 [Subtemas]
   3.2 [Subtemas]
   
4. REFERENCIAS BIBLIOGRÁFICAS`;
  }

  return `${basePrompt}

${structureExample}

CONSIDERACIONES SOBRE LA LONGITUD:
- Para documentos de 10-15 páginas: Incluir solo las secciones y subsecciones esenciales.
- Para documentos de 15-20 páginas: Añadir algunas subsecciones adicionales en las áreas principales.
- Para documentos de 20-30 páginas: Incluir subsecciones más detalladas y considerar añadir 1-2 secciones adicionales en cada área temática.
- Para documentos de 30-45 páginas: Desarrollar un índice completo con múltiples subsecciones y niveles de detalle.

EL ÍNDICE DEBE REFLEJAR DIRECTAMENTE EL RANGO DE PÁGINAS ${length} EN SU EXTENSIÓN Y DETALLE.

Información adicional a considerar: ${
    additionalInfo || "No hay información adicional"
  }

IMPORTANTE:
- Adapta el índice específicamente al tema: "${topic}"
- Ajusta la cantidad de secciones y subsecciones según la longitud exacta del documento (${length} páginas)
- Genera solo el índice, sin explicaciones adicionales
- Mantén EXACTAMENTE la estructura y formato de numeración indicados arriba`;
}

/**
 * Genera un índice de respaldo en caso de fallo de la API
 */
function generateFallbackIndex({
  documentType,
  topic,
  length,
  indexStructure,
}) {
  const title = topic.toUpperCase();

  // Determinar nivel de detalle basado en la longitud exacta
  const isShortDocument = length === "10-15";
  const isMediumDocument = length === "15-20";
  const isLongDocument = length === "20-30";
  const isVeryLongDocument = length === "30-45";

  // Manejar ensayos de forma diferente
  if (documentType.toLowerCase() === "ensayo") {
    // Determinar el número de subtemas basado en la longitud
    const maxPages = parseInt(length.split("-")[1]);
    let numSubtemas = 3; // Valor por defecto

    if (maxPages <= 2) {
      numSubtemas = 2;
    } else if (maxPages <= 5) {
      numSubtemas = 3;
    } else if (maxPages <= 12) {
      numSubtemas = 4;
    } else {
      numSubtemas = 5;
    }

    // Generar subtemas básicos para el ensayo
    const subtemas = [];
    for (let i = 1; i <= numSubtemas; i++) {
      subtemas.push(`        Subtema específico ${i} para "${topic}"`);
    }

    return `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del tema
   1.2 Relevancia y contexto
   1.3 Tesis o argumento principal

II. DESARROLLO
${subtemas.join("\n")}

III. CONCLUSIÓN
   3.1 Recapitulación de puntos principales
   3.2 Síntesis del argumento global
   3.3 Reflexiones finales y proyecciones

IV. REFERENCIAS BIBLIOGRÁFICAS`;
  }

  // Para otros tipos de documentos
  const structures = {
    estandar: `${title}

1. INTRODUCCIÓN
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación
   ${isLongDocument || isVeryLongDocument ? "1.4 Alcance del estudio" : ""}

2. DESARROLLO
   2.1 Subtema principal
   2.2 Análisis detallado
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "2.3 Desarrollo extendido"
       : ""
   }
   ${isLongDocument || isVeryLongDocument ? "2.4 Análisis complementario" : ""}
   ${isVeryLongDocument ? "2.5 Perspectivas adicionales" : ""}

3. CONCLUSIONES
   3.1 Síntesis de hallazgos
   3.2 Consideraciones finales
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "3.3 Recomendaciones"
       : ""
   }
   ${isVeryLongDocument ? "3.4 Limitaciones y trabajo futuro" : ""}

4. REFERENCIAS BIBLIOGRÁFICAS`,

    capitulos: `${title}

CAPITULO I: ASPECTOS INTRODUCTORIOS
1.1 Introducción al tema
1.2 Contexto histórico
${
  isMediumDocument || isLongDocument || isVeryLongDocument
    ? "1.3 Antecedentes relevantes"
    : ""
}
${isVeryLongDocument ? "1.4 Justificación del estudio" : ""}

CAPITULO II: DESARROLLO CONCEPTUAL
2.1 Desarrollo conceptual
2.2 Análisis detallado
${
  isMediumDocument || isLongDocument || isVeryLongDocument
    ? "2.3 Profundización temática"
    : ""
}
${isLongDocument || isVeryLongDocument ? "2.4 Marcos de referencia" : ""}
${isVeryLongDocument ? "2.5 Estudios relacionados" : ""}

CAPITULO III: ANÁLISIS Y DISCUSIÓN
3.1 Análisis de resultados
3.2 Discusión de hallazgos
${
  isMediumDocument || isLongDocument || isVeryLongDocument
    ? "3.3 Interpretación extendida"
    : ""
}
${
  isLongDocument || isVeryLongDocument
    ? "3.4 Comparación con estudios previos"
    : ""
}
${isVeryLongDocument ? "3.5 Implicaciones prácticas" : ""}

CAPITULO IV: CONCLUSIONES
4.1 Conclusiones
4.2 Recomendaciones
${
  isMediumDocument || isLongDocument || isVeryLongDocument
    ? "4.3 Perspectivas futuras"
    : ""
}
${isVeryLongDocument ? "4.4 Limitaciones del estudio" : ""}
${isVeryLongDocument ? "4.5 Propuestas para investigaciones futuras" : ""}

Referencias bibliográficas`,

    academica: `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "1.3 Alcance del estudio"
       : ""
   }
   ${isVeryLongDocument ? "1.4 Limitaciones de la investigación" : ""}

II. OBJETIVOS
   2.1 Objetivo general
   2.2 Objetivos específicos
   ${
     isLongDocument || isVeryLongDocument
       ? "2.3 Preguntas de investigación"
       : ""
   }

III. MARCO TEÓRICO
   3.1 Antecedentes
   3.2 Bases teóricas
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "3.3 Estado del arte"
       : ""
   }
   ${isLongDocument || isVeryLongDocument ? "3.4 Definición de términos" : ""}
   ${isVeryLongDocument ? "3.5 Hipótesis de trabajo" : ""}

IV. METODOLOGÍA
   4.1 Tipo de investigación
   4.2 Técnicas e instrumentos
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "4.3 Procedimientos metodológicos"
       : ""
   }
   ${isLongDocument || isVeryLongDocument ? "4.4 Población y muestra" : ""}
   ${isVeryLongDocument ? "4.5 Análisis de datos" : ""}

V. RESULTADOS Y DISCUSIÓN
   5.1 Presentación de resultados
   5.2 Análisis de hallazgos
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "5.3 Discusión extendida"
       : ""
   }
   ${
     isLongDocument || isVeryLongDocument
       ? "5.4 Interpretación de resultados"
       : ""
   }
   ${isVeryLongDocument ? "5.5 Contrastación con otras investigaciones" : ""}

VI. CONCLUSIONES
   6.1 Conclusiones
   6.2 Recomendaciones
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "6.3 Líneas futuras de investigación"
       : ""
   }
   ${isVeryLongDocument ? "6.4 Implicaciones prácticas y teóricas" : ""}

VII. REFERENCIAS BIBLIOGRÁFICAS
${isLongDocument || isVeryLongDocument ? "\nVIII. ANEXOS" : ""}`,
  };

  return structures[indexStructure] || structures.estandar;
}

// Middleware de validación básica
const validateGenerateIndex = (req, res, next) => {
  const { documentType, topic, length, indexStructure } = req.body;

  const errors = [];

  if (!documentType) errors.push("El tipo de documento es requerido");
  if (!topic || topic.length < 3)
    errors.push("El tema debe tener al menos 3 caracteres");
  if (!length) errors.push("La longitud es requerida");
  if (!indexStructure) errors.push("La estructura de índice es requerida");

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      details: errors,
    });
  }

  next();
};

// Ruta principal para generar índice
app.post(
  "/api/generate-index",
  validateGenerateIndex,
  // Middleware condicional para CAPTCHA - omitir si está deshabilitado
  (req, res, next) => {
    if (process.env.DISABLE_CAPTCHA === "true") {
      return next();
    }
    verifyCaptcha(req, res, next);
  },
  // Middleware para términos - omitir si está deshabilitado
  (req, res, next) => {
    if (process.env.DISABLE_PRIVACY_CHECK === "true") {
      return next();
    }
    verifyPrivacyAcceptance(req, res, next);
  },
  async (req, res) => {
    try {
      console.log("🚀 Solicitud de generación de índice recibida");
      console.log("📦 Datos recibidos:", JSON.stringify(req.body, null, 2));
      console.log("🔍 Origen:", req.get("origin"));

      // Establecer cabeceras CORS explícitamente
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );

      const {
        documentType,
        topic,
        length,
        indexStructure = "estandar",
        additionalInfo = "",
      } = req.body;

      // Verificar API key de Claude
      if (!process.env.CLAUDE_API_KEY) {
        console.error("❌ CLAUDE_API_KEY no configurada");
        return res.status(500).json({
          error: "Error de configuración del servidor",
          details: "API key no configurada",
        });
      }

      // Generar prompt específico para la estructura
      const prompt = getPromptForStructure(
        indexStructure,
        documentType,
        topic,
        length,
        additionalInfo
      );

      console.log("Prompt generado:", prompt);

      // Consulta a la API de Claude
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      // Manejo de respuesta de Claude
      if (!response.ok) {
        console.error("Error de Claude:", response.status);
        // Usar fallback con la estructura correcta
        const fallbackIndex = generateFallbackIndex({
          documentType,
          topic,
          length,
          indexStructure,
        });

        return res.status(200).json({
          index: fallbackIndex,
          source: "fallback",
        });
      }

      // Procesar respuesta de Claude
      const data = await response.json();
      return res.status(200).json({
        index: data.content[0].text,
        source: "claude",
      });
    } catch (error) {
      console.error("🚨 Error completo en generación de índice:", error);

      // En caso de cualquier error, usar el índice de respaldo
      const fallbackIndex = generateFallbackIndex(req.body);
      return res.status(200).json({
        index: fallbackIndex,
        source: "fallback",
      });
    }
  }
);

// Ruta para verificar la salud del API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API está funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Ruta para append-to-sheet (en caso de que la implementes más adelante)
app.post(
  "/api/append-to-sheet",
  // Middleware condicional para CAPTCHA - omitir si está deshabilitado
  (req, res, next) => {
    if (process.env.DISABLE_CAPTCHA === "true") {
      return next();
    }
    verifyCaptcha(req, res, next);
  },
  // Middleware para términos - omitir si está deshabilitado
  (req, res, next) => {
    if (process.env.DISABLE_PRIVACY_CHECK === "true") {
      return next();
    }
    verifyPrivacyAcceptance(req, res, next);
  },
  async (req, res) => {
    // Implementación futura
    res
      .status(501)
      .json({ message: "Esta funcionalidad aún no está implementada" });
  }
);

// Manejador de error 404
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
  });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error("Error global:", err);

  // No exponer detalles del error en producción
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Error interno del servidor"
      : err.message;

  res.status(statusCode).json({
    status: "error",
    message,
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🔗 Entorno: ${process.env.NODE_ENV || "development"}`);
});

export default app;
