// api/generate-index.js
export default async function handler(req, res) {
  try {
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

    const { documentType, topic, length, indexStructure, additionalInfo } =
      req.body;

    console.log("Datos recibidos:", {
      documentType,
      topic,
      length,
      indexStructure,
    });

    // Validar campos requeridos
    if (!documentType || !topic || !length || !indexStructure) {
      return res.status(400).json({
        error: "Campos requeridos faltantes",
      });
    }

    // Preparar el prompt según la estructura seleccionada
    const structureTemplates = {
      estandar: `
1. Introducción
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación

2. Desarrollo
   2.1 [Subtemas según el tema]
   2.2 [Análisis detallado]

3. Conclusiones
   3.1 Síntesis
   3.2 Consideraciones finales

4. Referencias bibliográficas`,

      capitulos: `
CAPITULO I: [Nombre relacionado a la introducción]
1.1 [Subtema introductorio]
1.2 [Contexto]

CAPITULO II: [Nombre relacionado al desarrollo]
2.1 [Desarrollo principal]
2.2 [Análisis]

CAPITULO III: [Nombre relacionado al análisis]
3.1 [Resultados]
3.2 [Discusión]

CAPITULO IV: [Nombre relacionado a conclusiones]
4.1 Conclusiones
4.2 Recomendaciones

Referencias bibliográficas`,

      academica: `
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

VII. REFERENCIAS BIBLIOGRÁFICAS`,
    };

    const selectedTemplate = structureTemplates[indexStructure];

    const prompt = `Genera un índice para un ${documentType} sobre "${topic}". El documento será de ${length} páginas.

IMPORTANTE: El índice DEBE seguir EXACTAMENTE esta estructura:

${selectedTemplate}

Información adicional: ${additionalInfo || "No hay información adicional"}

REGLAS:
1. Mantén EXACTAMENTE el formato de numeración mostrado arriba
2. Adapta los subtemas al tema específico "${topic}"
3. NO agregues secciones adicionales ni cambies el orden
4. NO incluyas explicaciones, solo el índice
5. Usa el título en mayúsculas al inicio`;

    console.log("Enviando prompt a Claude:", prompt);

    // Llamada a la API de Claude
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Claude:", errorText);
      throw new Error(`Error en la API de Claude: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta de Claude:", data);

    return res.status(200).json({
      index: data.content[0].text,
      source: "claude",
      structureUsed: indexStructure,
    });
  } catch (error) {
    console.error("Error en generate-index:", error);

    // Si hay error, usar plantilla como fallback
    const fallbackIndex = generateFallbackIndex(req.body);

    return res.status(200).json({
      index: fallbackIndex,
      source: "fallback",
      error: error.message,
    });
  }
}

// Función de fallback
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
