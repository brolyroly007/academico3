// api/generate-index.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

function generateFallbackIndex({
  documentType,
  topic,
  length,
  indexStructure,
}) {
  const title = topic.toUpperCase();
  const isLongDocument = length.toLowerCase().includes("largo");

  // Estructuras predefinidas según el tipo seleccionado
  const structures = {
    estandar: `${title}

1. Introducción
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación

2. Desarrollo
   2.1 Subtema principal
   2.2 Análisis detallado
   ${
     isLongDocument
       ? "2.3 Desarrollo extendido\n   2.4 Análisis complementario"
       : ""
   }

3. Conclusiones
   3.1 Síntesis de hallazgos
   3.2 Consideraciones finales
   ${isLongDocument ? "3.3 Recomendaciones" : ""}

4. Referencias bibliográficas`,

    capitulos: `${title}

CAPITULO I: ASPECTOS INTRODUCTORIOS
1.1 Introducción al tema
1.2 Contexto histórico
${isLongDocument ? "1.3 Antecedentes relevantes" : ""}

CAPITULO II: DESARROLLO CONCEPTUAL
2.1 Desarrollo conceptual
2.2 Análisis detallado
${isLongDocument ? "2.3 Profundización temática" : ""}

CAPITULO III: ANÁLISIS Y DISCUSIÓN
3.1 Análisis de resultados
3.2 Discusión de hallazgos
${isLongDocument ? "3.3 Interpretación extendida" : ""}

CAPITULO IV: CONCLUSIONES
4.1 Conclusiones
4.2 Recomendaciones
${isLongDocument ? "4.3 Perspectivas futuras" : ""}

Referencias bibliográficas`,

    academica: `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación
   ${isLongDocument ? "1.3 Alcance del estudio" : ""}

II. OBJETIVOS
   2.1 Objetivo general
   2.2 Objetivos específicos

III. MARCO TEÓRICO
   3.1 Antecedentes
   3.2 Bases teóricas
   ${isLongDocument ? "3.3 Estado del arte" : ""}

IV. METODOLOGÍA
   4.1 Tipo de investigación
   4.2 Técnicas e instrumentos
   ${isLongDocument ? "4.3 Procedimientos metodológicos" : ""}

V. RESULTADOS Y DISCUSIÓN
   5.1 Presentación de resultados
   5.2 Análisis de hallazgos
   ${isLongDocument ? "5.3 Discusión extendida" : ""}

VI. CONCLUSIONES
   6.1 Conclusiones
   6.2 Recomendaciones
   ${isLongDocument ? "6.3 Líneas futuras de investigación" : ""}

VII. REFERENCIAS BIBLIOGRÁFICAS`,
  };

  return structures[indexStructure] || structures.estandar;
}

function getPromptForStructure(
  indexStructure,
  documentType,
  topic,
  length,
  additionalInfo
) {
  const basePrompt = `Genera un índice para un ${documentType} sobre "${topic}". 
El documento será de ${length}.`;

  const structureInstructions = {
    estandar: `
IMPORTANTE: Usa EXACTAMENTE esta estructura:
[Título]
1. Introducción
   1.1 [Subtemas]
2. Desarrollo
   2.1 [Subtemas]
3. Conclusiones
   3.1 [Subtemas]
4. Referencias bibliográficas`,

    capitulos: `
IMPORTANTE: Usa EXACTAMENTE esta estructura:
[Título]
CAPITULO I: [Nombre]
1.1 [Subtemas]
1.2 [Subtemas]

CAPITULO II: [Nombre]
2.1 [Subtemas]
2.2 [Subtemas]

CAPITULO III: [Nombre]
3.1 [Subtemas]
3.2 [Subtemas]

CAPITULO IV: [Nombre]
4.1 [Subtemas]
4.2 [Subtemas]

Referencias bibliográficas`,

    academica: `
IMPORTANTE: Usa EXACTAMENTE esta estructura:
[Título]
I. Introducción
   1.1 Planteamiento del problema
   1.2 Justificación

II. Objetivos
   2.1 Objetivo general
   2.2 Objetivos específicos

III. Marco Teórico
    3.1 Antecedentes
    3.2 Bases teóricas

IV. Metodología
    4.1 Tipo de investigación
    4.2 Técnicas e instrumentos

V. Resultados y Discusión
   5.1 Presentación de resultados
   5.2 Análisis de hallazgos

VI. Conclusiones
    6.1 Conclusiones
    6.2 Recomendaciones

VII. Referencias Bibliográficas`,
  };

  return `${basePrompt}
  
${structureInstructions[indexStructure] || structureInstructions.estandar}
  
Información adicional a considerar: ${
    additionalInfo || "No hay información adicional"
  }
  
IMPORTANTE: Mantén EXACTAMENTE la estructura y formato de numeración indicados arriba.
Genera solo el índice, sin explicaciones adicionales.`;
}

export default async function handler(req, res) {
  // Establecer cabeceras CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { documentType, topic, length, indexStructure, additionalInfo } =
      req.body;

    // Log detallado de los datos recibidos
    console.log("Datos recibidos:", {
      documentType,
      topic,
      length,
      indexStructure,
      additionalInfo,
    });

    // Validación específica de la estructura
    if (
      !indexStructure ||
      !["estandar", "capitulos", "academica"].includes(indexStructure)
    ) {
      console.error("Estructura inválida o no especificada:", indexStructure);
      return res.status(400).json({
        error: "Estructura de índice inválida",
        received: indexStructure,
        valid: ["estandar", "capitulos", "academica"],
      });
    }

    // Validación de otros campos requeridos
    if (!documentType || !topic || !length) {
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        received: req.body,
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

    console.log("Estructura seleccionada:", indexStructure);
    console.log("Prompt generado:", prompt);

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

    if (!response.ok) {
      console.error("Error de Claude:", response.status);
      const fallbackIndex = generateFallbackIndex({
        documentType,
        topic,
        length,
        indexStructure, // Pasar la estructura al fallback
      });
      return res.status(200).json({
        index: fallbackIndex,
        source: "fallback",
        structureUsed: indexStructure, // Incluir la estructura usada en la respuesta
      });
    }

    const data = await response.json();
    return res.status(200).json({
      index: data.content[0].text,
      source: "claude",
      structureUsed: indexStructure, // Incluir la estructura usada en la respuesta
    });
  } catch (error) {
    console.error("Error generando índice:", error);
    const fallbackIndex = generateFallbackIndex(req.body);
    return res.status(200).json({
      index: fallbackIndex,
      source: "fallback",
      error: error.message,
    });
  }
}
