import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { google } from "googleapis";
import morgan from "morgan";
import fetch from "node-fetch";

// Configuración inicial
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Logging para desarrollo

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

// Ruta principal para generar índice
app.post("/api/generate-index", async (req, res) => {
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

    // Validación de campos requeridos
    if (!documentType || !topic || !length || !indexStructure) {
      console.error("❌ Campos requeridos faltantes");
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        received: req.body,
      });
    }

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
});

// Ruta para verificar la salud del API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API está funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🔗 Entorno: ${process.env.NODE_ENV || "development"}`);
});

export default app;
