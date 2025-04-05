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

    // Extraer el número máximo de páginas del rango
    const maxPages = parseInt(length.split("-")[1]);

    // Calcular el número de secciones y subsecciones basado en la cantidad de páginas
    const numMainSections = Math.max(3, Math.min(15, Math.floor(maxPages / 4)));
    const numLevel2Subsections = Math.max(
      2,
      Math.min(6, Math.floor(maxPages / 8))
    );
    const numLevel3Subsections = Math.max(
      1,
      Math.min(4, Math.floor(maxPages / 12))
    );
    const numLevel4Subsections = Math.max(
      1,
      Math.min(3, Math.floor(maxPages / 16))
    );

    // Preparar el prompt según la estructura seleccionada
    const structureTemplates = {
      estandar: `
1. Introducción
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación
   ${maxPages >= 20 ? "1.4 Alcance del estudio" : ""}

2. Desarrollo
   2.1 [Subtemas según el tema]
   2.2 [Análisis detallado]
   ${maxPages >= 15 ? "2.3 Desarrollo extendido" : ""}
   ${maxPages >= 20 ? "2.4 Análisis complementario" : ""}
   ${maxPages >= 30 ? "2.5 Perspectivas adicionales" : ""}

3. Conclusiones
   3.1 Síntesis
   3.2 Consideraciones finales
   ${maxPages >= 15 ? "3.3 Recomendaciones" : ""}
   ${maxPages >= 30 ? "3.4 Limitaciones y trabajo futuro" : ""}

4. Referencias bibliográficas`,

      capitulos: `
CAPITULO I: [Nombre relacionado a la introducción]
1.1 [Subtema introductorio]
1.2 [Contexto]
${maxPages >= 15 ? "1.3 [Antecedentes relevantes]" : ""}
${maxPages >= 30 ? "1.4 [Justificación del estudio]" : ""}

CAPITULO II: [Nombre relacionado al desarrollo]
2.1 [Desarrollo principal]
2.2 [Análisis]
${maxPages >= 15 ? "2.3 [Profundización temática]" : ""}
${maxPages >= 20 ? "2.4 [Marcos de referencia]" : ""}
${maxPages >= 30 ? "2.5 [Estudios relacionados]" : ""}

CAPITULO III: [Nombre relacionado al análisis]
3.1 [Resultados]
3.2 [Discusión]
${maxPages >= 15 ? "3.3 [Interpretación extendida]" : ""}
${maxPages >= 20 ? "3.4 [Comparación con estudios previos]" : ""}
${maxPages >= 30 ? "3.5 [Implicaciones prácticas]" : ""}

CAPITULO IV: [Nombre relacionado a conclusiones]
4.1 Conclusiones
4.2 Recomendaciones
${maxPages >= 15 ? "4.3 [Perspectivas futuras]" : ""}
${maxPages >= 20 ? "4.4 [Limitaciones del estudio]" : ""}
${maxPages >= 30 ? "4.5 [Propuestas para investigaciones futuras]" : ""}

Referencias bibliográficas`,

      academica: `
I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación
   ${maxPages >= 15 ? "1.3 Alcance del estudio" : ""}
   ${maxPages >= 30 ? "1.4 Limitaciones de la investigación" : ""}

II. OBJETIVOS
   2.1 Objetivo general
   2.2 Objetivos específicos
   ${maxPages >= 20 ? "2.3 Preguntas de investigación" : ""}
   ${maxPages >= 30 ? "2.3 Hipótesis de trabajo" : ""}

III. MARCO TEÓRICO
    3.1 Antecedentes
    3.2 Bases teóricas
    ${maxPages >= 15 ? "3.3 Estado del arte" : ""}
    ${maxPages >= 20 ? "3.4 Definición de términos" : ""}
    ${maxPages >= 30 ? "3.5 Corrientes teóricas relacionadas" : ""}

IV. METODOLOGÍA
    4.1 Tipo de investigación
    4.2 Técnicas e instrumentos
    ${maxPages >= 15 ? "4.3 Procedimientos metodológicos" : ""}
    ${maxPages >= 20 ? "4.4 Población y muestra" : ""}
    ${maxPages >= 30 ? "4.5 Análisis de datos" : ""}

V. RESULTADOS Y DISCUSIÓN
   5.1 Presentación de resultados
   5.2 Análisis de hallazgos
   ${maxPages >= 15 ? "5.3 Discusión extendida" : ""}
   ${maxPages >= 20 ? "5.4 Interpretación de resultados" : ""}
   ${maxPages >= 30 ? "5.5 Contrastación con otras investigaciones" : ""}

VI. CONCLUSIONES
    6.1 Conclusiones
    6.2 Recomendaciones
    ${maxPages >= 15 ? "6.3 Líneas futuras de investigación" : ""}
    ${maxPages >= 30 ? "6.4 Implicaciones prácticas y teóricas" : ""}

VII. REFERENCIAS BIBLIOGRÁFICAS
${maxPages >= 20 ? "\nVIII. ANEXOS" : ""}`,
    };

    // Estructura especial para ensayos
    const ensayoTemplate = `
I. INTRODUCCIÓN
   1.1 Planteamiento del tema
   1.2 Relevancia y contexto
   1.3 Tesis o argumento principal

II. DESARROLLO
   2.1 Primer argumento
      2.1.1 Evidencias y ejemplos
      2.1.2 Análisis del argumento
   
   2.2 Segundo argumento
      2.2.1 Evidencias y ejemplos
      2.2.2 Análisis del argumento
   
   2.3 Tercer argumento
      2.3.1 Evidencias y ejemplos
      2.3.2 Análisis del argumento
   
   2.4 Contraargumentos
      2.4.1 Presentación de posturas contrarias
      2.4.2 Refutación de contraargumentos

III. CONCLUSIÓN
   3.1 Recapitulación de puntos principales
   3.2 Síntesis del argumento global
   3.3 Reflexiones finales y proyecciones

IV. REFERENCIAS BIBLIOGRÁFICAS`;

    // Seleccionar la plantilla adecuada o la de ensayo si el tipo es ensayo
    const selectedTemplate =
      documentType.toLowerCase() === "ensayo"
        ? ensayoTemplate
        : structureTemplates[indexStructure];

    // Construir el prompt de acuerdo al tipo de documento
    let prompt;

    if (documentType.toLowerCase() === "ensayo") {
      prompt = `Genera un índice para un ensayo académico sobre "${topic}".
      
El índice debe seguir EXACTAMENTE esta estructura:

${selectedTemplate}

Información adicional: ${additionalInfo || "No hay información adicional"}

REGLAS:
1. Mantén EXACTAMENTE el formato de numeración mostrado arriba
2. Adapta los subtemas y argumentos específicamente al tema: "${topic}"
3. NO agregues secciones adicionales ni cambies el orden
4. NO incluyas explicaciones, solo el índice
5. Usa el título en mayúsculas al inicio`;
    } else {
      prompt = `Genera un índice detallado para un ${documentType} de ${length} páginas sobre el tema "${topic}".

El índice debe seguir EXACTAMENTE esta estructura:

${selectedTemplate}

CONSIDERACIONES SOBRE LA LONGITUD:
- Para documentos de 10-15 páginas: Incluir solo las secciones y subsecciones esenciales.
- Para documentos de 15-20 páginas: Añadir algunas subsecciones adicionales en las áreas principales.
- Para documentos de 20-30 páginas: Incluir subsecciones más detalladas y considerar añadir 1-2 secciones adicionales en cada área temática.
- Para documentos de 30-45 páginas: Desarrollar un índice completo con múltiples subsecciones y niveles de detalle.

EL ÍNDICE DEBE REFLEJAR DIRECTAMENTE EL RANGO DE PÁGINAS ${length} EN SU EXTENSIÓN Y DETALLE.

Información adicional: ${additionalInfo || "No hay información adicional"}

REGLAS:
1. Mantén EXACTAMENTE el formato de numeración mostrado arriba
2. Adapta los subtemas al tema específico "${topic}"
3. Ajusta la cantidad de secciones y subsecciones según la longitud del documento (${length} páginas)
4. NO incluyas explicaciones, solo el índice
5. Usa el título en mayúsculas al inicio`;
    }

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

  // Determinar el nivel de detalle según la longitud
  const isShortDocument = length === "10-15";
  const isMediumDocument = length === "15-20";
  const isLongDocument = length === "20-30";
  const isVeryLongDocument = length === "30-45";

  // Manejo especial para ensayos
  if (documentType.toLowerCase() === "ensayo") {
    return `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del tema
   1.2 Relevancia y contexto
   1.3 Tesis o argumento principal

II. DESARROLLO
   2.1 Primer argumento
      2.1.1 Evidencias y ejemplos
      2.1.2 Análisis del argumento
   
   2.2 Segundo argumento
      2.2.1 Evidencias y ejemplos
      2.2.2 Análisis del argumento
   
   2.3 Tercer argumento
      2.3.1 Evidencias y ejemplos
      2.3.2 Análisis del argumento
   
   2.4 Contraargumentos
      2.4.1 Presentación de posturas contrarias
      2.4.2 Refutación de contraargumentos

III. CONCLUSIÓN
   3.1 Recapitulación de puntos principales
   3.2 Síntesis del argumento global
   3.3 Reflexiones finales y proyecciones

IV. REFERENCIAS BIBLIOGRÁFICAS`;
  }

  const structures = {
    estandar: `${title}

1. Introducción
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación
   ${isLongDocument || isVeryLongDocument ? "1.4 Alcance del estudio" : ""}

2. Desarrollo
   2.1 Subtema principal
   2.2 Análisis detallado
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "2.3 Desarrollo extendido"
       : ""
   }
   ${isLongDocument || isVeryLongDocument ? "2.4 Análisis complementario" : ""}
   ${isVeryLongDocument ? "2.5 Perspectivas adicionales" : ""}

3. Conclusiones
   3.1 Síntesis de hallazgos
   3.2 Consideraciones finales
   ${
     isMediumDocument || isLongDocument || isVeryLongDocument
       ? "3.3 Recomendaciones"
       : ""
   }
   ${isVeryLongDocument ? "3.4 Limitaciones y trabajo futuro" : ""}

4. Referencias bibliográficas`,

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
