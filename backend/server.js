function getPromptForStructure(
  indexStructure,
  documentType,
  topic,
  length,
  additionalInfo
) {
  const basePrompt = `Genera un índice para un ${documentType} sobre "${topic}". 
El documento será de ${length} páginas.`;

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

function generateFallbackIndex({
  documentType,
  topic,
  length,
  indexStructure,
}) {
  const title = topic.toUpperCase();

  // Determinar si es un documento extenso basado en los nuevos rangos
  const isLongDocument = length === "20-30" || length === "30-45";

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

// Modificación del endpoint de generación de índice
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
