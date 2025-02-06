// services/generateIndex.js
const fetch = require("node-fetch");

async function generateIndex(documentType, topic, length, additionalInfo = "") {
  try {
    const response = await fetch(process.env.CLAUDE_API_URL, {
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
            content: `Genera un índice para un ${documentType} sobre ${topic}. 
          El documento será de ${length}. 
          
          Si es un ensayo, usa esta estructura:
          [Título principal]
              1. Introducción
              2. Desarrollo
                  [3-4 Subtemas específicos]
              3. Conclusiones
              4. Bibliografía
          
          Si es una monografía, usa una estructura más detallada con:
          - 4-6 secciones principales en numeración romana
          - 2-3 subsecciones por sección en numeración arábiga
          - Formato: 
            I. Sección principal
                1.1 Subsección
                1.2 Subsección
          
          Información adicional a considerar: ${
            additionalInfo || "No hay información adicional"
          }
          
          Asegúrate de que el índice sea específico al tema y mantenga coherencia.
          Solo entrega el índice, sin explicaciones adicionales.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API de Claude: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error generando índice:", error);
    throw error;
  }
}

module.exports = generateIndex;
