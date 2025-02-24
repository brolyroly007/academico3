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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { documentType, topic, length, indexStructure, additionalInfo } =
      req.body;

    // Log detallado para debugging
    console.log("Datos recibidos:", {
      documentType,
      topic,
      length,
      indexStructure,
      additionalInfo,
    });
    console.log("CLAUDE_API_KEY presente:", !!process.env.CLAUDE_API_KEY);

    // Validar campos requeridos
    if (!documentType || !topic || !length || !indexStructure) {
      console.log("Faltan campos requeridos");
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        received: req.body,
      });
    }

    // Verificar API key
    if (!process.env.CLAUDE_API_KEY) {
      console.log("API key no configurada, usando fallback");
      return res.status(200).json({
        index: generateFallbackIndex(req.body),
        source: "fallback",
      });
    }

    try {
      // Llamada a Claude
      const claudeResponse = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            max_tokens: 4096,
            messages: [
              {
                role: "user",
                content: `Genera un índice para un ${documentType} sobre "${topic}". 
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
              
              Información adicional: ${
                additionalInfo || "No hay información adicional"
              }
              
              IMPORTANTE: Mantén EXACTAMENTE el formato de numeración y estructura indicados arriba.
              Genera solo el índice, sin explicaciones adicionales.`,
              },
            ],
          }),
        }
      );

      // Log de la respuesta de Claude
      console.log("Estado de respuesta Claude:", claudeResponse.status);

      if (!claudeResponse.ok) {
        const errorText = await claudeResponse.text();
        console.error("Error de Claude:", errorText);
        throw new Error(`Error en la API de Claude: ${claudeResponse.status}`);
      }

      const data = await claudeResponse.json();
      console.log("Respuesta exitosa de Claude");

      return res.status(200).json({
        index: data.content[0].text,
        source: "claude",
      });
    } catch (claudeError) {
      console.error("Error en llamada a Claude:", claudeError);
      // Si falla Claude, usar fallback
      return res.status(200).json({
        index: generateFallbackIndex(req.body),
        source: "fallback",
        error: claudeError.message,
      });
    }
  } catch (error) {
    console.error("Error general:", error);
    // Error general, usar fallback
    return res.status(200).json({
      index: generateFallbackIndex(req.body),
      source: "fallback",
      error: error.message,
    });
  }
}
