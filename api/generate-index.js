import fetch from "node-fetch";

export default async function handler(req, res) {
  // Configuración de CORS
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

  // Manejo de solicitudes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Log de depuración
  console.log("Solicitud recibida:", {
    method: req.method,
    body: req.body,
    headers: req.headers,
  });

  // Validación de método
  if (req.method !== "POST") {
    console.error("Método no permitido:", req.method);
    return res.status(405).json({
      error: "Método no permitido",
      receivedMethod: req.method,
    });
  }

  try {
    // Validación de campos
    const {
      documentType,
      topic,
      length,
      additionalInfo,
      indexStructure = "estandar",
    } = req.body;

    if (!documentType || !topic || !length) {
      console.error("Campos requeridos faltantes:", req.body);
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        received: req.body,
      });
    }

    // Verificación de API Key
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    if (!CLAUDE_API_KEY) {
      console.error("API Key de Claude no configurada");
      return res.status(500).json({
        error: "Error de configuración del servidor",
        details: "API key no configurada",
      });
    }

    // Definición de estructura de prompt
    const structurePrompt =
      indexStructure === "capitulos"
        ? `Estructura por capítulos:
        - Capítulos en numeración romana (I, II, III...)
        - Subsecciones en decimal (1.1, 1.2)
        - Incluye: Introducción, Marco Teórico, Metodología, Resultados`
        : `Estructura estándar:
        - Secciones numeradas (1, 2, 3...)
        - Subsecciones en decimal (2.1, 2.2)
        - Incluye: Introducción, Desarrollo, Conclusiones`;

    // Llamada a la API de Claude
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Genera un índice para ${documentType} sobre "${topic}".
          Documento de ${length}. 
          
          ${structurePrompt}
          
          Información adicional: ${additionalInfo || "Sin información extra"}
          
          Genera un índice específico, coherente y conciso.`,
          },
        ],
      }),
    });

    // Manejo de respuesta de Claude
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Claude:", errorText);
      throw new Error(`Error en API de Claude: ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json({
      index: data.content[0].text,
      source: "claude",
    });
  } catch (error) {
    console.error("Error en generación de índice:", error);
    return res.status(500).json({
      error: "Error al generar índice",
      details: error.message,
    });
  }
}
