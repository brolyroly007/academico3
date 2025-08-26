// api/generate-annexes.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, topic, documentType, index } = req.body;
    
    if (!prompt || !topic || !documentType || !index) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Usar la misma API de Gemini que ya está configurada en el proyecto
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'API key not configured',
        fallback: true 
      });
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const suggestions = data.candidates[0].content.parts[0].text;
      
      return res.status(200).json({
        success: true,
        suggestions: suggestions
      });
    } else {
      throw new Error('Invalid response from Gemini API');
    }

  } catch (error) {
    console.error('Error generating annex suggestions:', error);
    
    // Fallback: devolver sugerencias predeterminadas contextuales
    const fallbackSuggestions = generateFallbackSuggestions(req.body.topic, req.body.documentType);
    
    return res.status(200).json({
      success: true,
      suggestions: fallbackSuggestions,
      fallback: true
    });
  }
}

// Función de fallback para generar sugerencias básicas
function generateFallbackSuggestions(topic, documentType) {
  // Generar sugerencias específicas basadas en el tema
  const topicLower = topic.toLowerCase();
  
  // Sugerencias específicas por tema
  if (topicLower.includes('redes sociales') || topicLower.includes('social media')) {
    return [
      "1. Timeline de las principales redes sociales",
      "2. Fundadores de Facebook, Twitter e Instagram", 
      "3. Estadísticas de usuarios por red social 2024",
      "4. Comparativa: WhatsApp vs Telegram",
      "5. Evolución del diseño de Facebook (2004-2024)",
      "6. Capturas de la primera versión de Twitter",
      "7. Países con más usuarios de TikTok",
      "8. Fotografías de Mark Zuckerberg y otros CEO",
      "9. Infografía: Tiempo promedio en redes sociales",
      "10. Screenshots de interfaces antiguas vs actuales"
    ].join('\n');
  } else if (topicLower.includes('inteligencia artificial') || topicLower.includes('ia') || topicLower.includes('chatgpt')) {
    return [
      "1. Timeline del desarrollo de ChatGPT",
      "2. Comparativa de modelos de IA: GPT vs Gemini",
      "3. Fotografías de robots humanoides actuales",
      "4. Estadísticas de uso de ChatGPT mundial",
      "5. Capturas de pantalla de diferentes IAs",
      "6. Fundadores de OpenAI, Google DeepMind",
      "7. Línea de tiempo: desde Turing hasta GPT-4",
      "8. Países líderes en inversión en IA",
      "9. Imágenes generadas por DALL-E vs Midjourney",
      "10. Gráfico: Crecimiento de startups de IA"
    ].join('\n');
  }
  
  // Fallback general pero específico para el tema
  const baseSuggestions = [
    `1. Cronología histórica de ${topic}`,
    `2. Estadísticas actuales sobre ${topic}`,
    `3. Principales figuras relacionadas con ${topic}`,
    `4. Fotografías relevantes de ${topic}`,
    `5. Comparativa de aspectos clave en ${topic}`,
    `6. Documentos oficiales sobre ${topic}`,
    `7. Países/lugares importantes en ${topic}`,
    `8. Tecnologías utilizadas en ${topic}`,
    `9. Impacto económico de ${topic}`,
    `10. Tendencias futuras en ${topic}`
  ];

  return baseSuggestions.join('\n');
}