// api/generate-index.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  // Establecer cabeceras CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Manejar las solicitudes OPTIONS para CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Verificar que sea una solicitud POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { documentType, topic, length, additionalInfo } = req.body;

    // Validar campos requeridos
    if (!documentType || !topic || !length) {
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        received: req.body,
      });
    }

    // Verificar API key
    if (!process.env.CLAUDE_API_KEY) {
      console.error("CLAUDE_API_KEY no configurada");
      return res.status(500).json({
        error: "Error de configuración del servidor",
        details: "API key no configurada",
      });
    }

    // Generar el prompt basado en el tipo de documento
    const prompt =
      documentType.toLowerCase() === "ensayo"
        ? `Genera un índice para un ${documentType} sobre "${topic}". 
         El documento será de ${length}. 
         
         Usa esta estructura:
         [Título principal]
             1. Introducción
             2. Desarrollo
                 [3-4 Subtemas específicos]
             3. Conclusiones
             4. Bibliografía
         
         Información adicional a considerar: ${
           additionalInfo || "No hay información adicional"
         }
         
         Genera un índice específico al tema y mantén coherencia.
         Solo entrega el índice, sin explicaciones adicionales.`
        : `Genera un índice para un ${documentType} sobre "${topic}". 
         El documento será de ${length}. 
         
         Usa una estructura más detallada con:
         - 4-6 secciones principales en numeración romana
         - 2-3 subsecciones por sección en numeración arábiga
         - Formato: 
           I. Sección principal
               1.1 Subsección
               1.2 Subsección
         
         Información adicional a considerar: ${
           additionalInfo || "No hay información adicional"
         }
         
         Genera un índice específico al tema y mantén coherencia.
         Solo entrega el índice, sin explicaciones adicionales.`;

    // Realizar solicitud a Claude
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

    // Verificar respuesta de Claude
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Claude:", errorText);
      throw new Error(
        `Error en la API de Claude: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();

    // Generar respuesta exitosa
    return res.status(200).json({
      success: true,
      index: data.content[0].text,
      source: "claude",
    });
  } catch (error) {
    // Log detallado del error
    console.error("Error completo en generación de índice:", error);

    // Intentar generar un índice de respaldo
    try {
      const fallbackIndex = generateFallbackIndex(req.body);
      return res.status(200).json({
        success: true,
        index: fallbackIndex,
        source: "fallback",
        warning:
          "Se utilizó el generador de respaldo debido a un error con Claude",
      });
    } catch (fallbackError) {
      return res.status(500).json({
        error: "Error al generar índice",
        details: error.message,
        fullError: error.toString(),
      });
    }
  }
}

// Función de respaldo para generar índices
function generateFallbackIndex({ documentType, topic, length }) {
  const title = topic.toUpperCase();
  const isLongDocument = length.toLowerCase().includes("largo");

  if (documentType.toLowerCase() === "ensayo") {
    return `${title}

1. INTRODUCCIÓN
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación

2. DESARROLLO
   2.1 Marco teórico
   2.2 Análisis del tema
   2.3 Argumentación principal
   ${isLongDocument ? "2.4 Perspectivas adicionales\n   2.5 Implicaciones" : ""}

3. CONCLUSIONES
   3.1 Síntesis de ideas principales
   3.2 Reflexiones finales
   ${isLongDocument ? "3.3 Recomendaciones" : ""}

4. REFERENCIAS BIBLIOGRÁFICAS`;
  } else {
    return `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del tema
   1.2 Objetivos
   1.3 Metodología

II. MARCO TEÓRICO
   2.1 Antecedentes
   2.2 Fundamentos conceptuales
   ${isLongDocument ? "2.3 Estado del arte" : ""}

III. DESARROLLO
   3.1 Análisis principal
   3.2 Hallazgos
   ${isLongDocument ? "3.3 Discusión extendida" : ""}

IV. RESULTADOS
   4.1 Presentación de resultados
   4.2 Interpretación
   ${isLongDocument ? "4.3 Implicaciones" : ""}

V. CONCLUSIONES
   5.1 Conclusiones principales
   5.2 Recomendaciones

VI. REFERENCIAS BIBLIOGRÁFICAS`;
  }
}
