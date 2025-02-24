// api/generate-index.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

async function callClaudeAPI(prompt) {
  try {
    console.log("Llamando a Claude API con prompt:", prompt);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.CLAUDE_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    console.log("Respuesta de Claude status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Claude:", errorText);
      throw new Error(`Error en Claude API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Respuesta exitosa de Claude:", data);
    return data.content[0].text;
  } catch (error) {
    console.error("Error llamando a Claude:", error);
    throw error;
  }
}

function generateFallbackIndex({
  documentType,
  topic,
  length,
  indexStructure,
}) {
  const title = topic.toUpperCase();
  const isLongDocument = length.toLowerCase().includes("largo");

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

export default async function handler(req, res) {
  // Configurar CORS
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

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    console.log("Recibiendo solicitud:", req.body);

    const { documentType, topic, length, indexStructure, additionalInfo } =
      req.body;

    // Validar campos requeridos
    if (!documentType || !topic || !length || !indexStructure) {
      console.log("Campos faltantes:", {
        documentType,
        topic,
        length,
        indexStructure,
      });
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        received: req.body,
      });
    }

    // Verificar API key
    if (!process.env.CLAUDE_API_KEY) {
      console.log("API key de Claude no encontrada");
      return res.status(200).json({
        index: generateFallbackIndex(req.body),
        source: "fallback",
        reason: "API key no configurada",
      });
    }

    try {
      const prompt = `Genera un índice para un ${documentType} sobre "${topic}". 
      El documento será de ${length}.
      
      IMPORTANTE: El índice DEBE seguir EXACTAMENTE esta estructura (${indexStructure}):
      ${
        indexStructure === "estandar"
          ? `1. Introducción (con subsecciones 1.1, 1.2, etc)
           2. Desarrollo (con subsecciones 2.1, 2.2, etc)
           3. Conclusiones (con subsecciones 3.1, 3.2, etc)
           4. Referencias bibliográficas`
          : indexStructure === "capitulos"
          ? `CAPITULO I: [Nombre] (con subsecciones 1.1, 1.2, etc)
           CAPITULO II: [Nombre]
           CAPITULO III: [Nombre]
           CAPITULO IV: [Nombre]
           Referencias bibliográficas`
          : `I. Introducción
           II. Objetivos
           III. Marco Teórico
           IV. Metodología
           V. Resultados y Discusión
           VI. Conclusiones
           VII. Referencias Bibliográficas`
      }
      
      Información adicional: ${additionalInfo || "No hay información adicional"}
      
      IMPORTANTE: Mantén EXACTAMENTE el formato de numeración y estructura indicados arriba.
      Genera solo el índice, sin explicaciones adicionales.`;

      console.log("Intentando generar índice con Claude");
      const generatedIndex = await callClaudeAPI(prompt);

      console.log("Índice generado exitosamente");
      return res.status(200).json({
        index: generatedIndex,
        source: "claude",
      });
    } catch (claudeError) {
      console.error("Error al llamar a Claude:", claudeError);
      return res.status(200).json({
        index: generateFallbackIndex(req.body),
        source: "fallback",
        error: claudeError.message,
      });
    }
  } catch (error) {
    console.error("Error general en el endpoint:", error);
    return res.status(200).json({
      index: generateFallbackIndex(req.body),
      source: "fallback",
      error: error.message,
    });
  }
}
