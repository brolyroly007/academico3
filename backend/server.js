function getPromptForStructure(
  indexStructure,
  documentType,
  topic,
  length,
  additionalInfo
) {
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

  // Manejo especial para ensayos
  if (documentType.toLowerCase() === "ensayo") {
    return `Genera un índice para un ensayo académico sobre "${topic}".
    
El índice debe seguir la siguiente estructura:
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

IV. REFERENCIAS BIBLIOGRÁFICAS

Adapta los subtemas y argumentos específicamente al tema: "${topic}".
No incluyas explicaciones adicionales, solo el índice.
    
Información adicional a considerar: ${
      additionalInfo || "No hay información adicional"
    }`;
  }

  // Para otros tipos de documentos, usar un prompt más parametrizado
  const basePrompt = `Genera un índice detallado para un ${documentType} de ${length} páginas sobre el tema "${topic}".

El índice debe seguir la siguiente estructura:
- Aproximadamente ${numMainSections} secciones principales (nivel 1) en ROMANO
- Cada sección principal debe tener ${numLevel2Subsections}-${
    numLevel2Subsections + 1
  } subsecciones de nivel 2 EN ARÁBICO
- Algunas subsecciones de nivel 2 deben tener ${numLevel3Subsections}-${
    numLevel3Subsections + 1
  } subsecciones de nivel 3 EN ARÁBICO
- Ocasionalmente, incluye ${numLevel4Subsections}-${
    numLevel4Subsections + 1
  } subsecciones de nivel 4 donde sea apropiado

Asegúrate de incluir:
- Una introducción al principio
- Una conclusión al final
- Referencias bibliográficas`;

  // Añadir la estructura específica según el tipo
  let structureExample = "";

  if (indexStructure === "academica") {
    structureExample = `
Como ejemplo de formato, sigue este esquema pero adaptándolo al tema específico:
I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación del estudio
   
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
Como ejemplo de formato, sigue este esquema pero adaptándolo al tema específico:
CAPITULO I: [NOMBRE RELACIONADO A INTRODUCCIÓN]
1.1 Introducción al tema
1.2 Contexto histórico

CAPITULO II: [NOMBRE RELACIONADO A DESARROLLO]
2.1 Desarrollo conceptual
2.2 Análisis detallado

CAPITULO III: [NOMBRE RELACIONADO A ANÁLISIS]
3.1 Análisis de resultados
3.2 Discusión de hallazgos

CAPITULO IV: [NOMBRE RELACIONADO A CONCLUSIONES]
4.1 Conclusiones
4.2 Recomendaciones

Referencias bibliográficas`;
  } else {
    // estandar u otro
    structureExample = `
Como ejemplo de formato, sigue este esquema pero adaptándolo al tema específico:
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
   
4. Referencias bibliográficas`;
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
- Ajusta la cantidad de secciones y subsecciones según la longitud del documento (${length} páginas)
- Genera solo el índice, sin explicaciones adicionales`;
}

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

  // Para otros tipos de documentos, usar estructuras adaptadas a la longitud
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
