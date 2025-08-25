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
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyC4PKX3HoWtEcGlXTxRv20YuEvb2boZgOw";
    
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
  const baseSuggestions = [
    "1. Encuesta aplicada a participantes del estudio",
    "2. Tabla de datos estadísticos recolectados", 
    "3. Fotografías del proceso de investigación",
    "4. Instrumentos de recolección de datos utilizados",
    "5. Esquemas y mapas conceptuales del tema",
    "6. Cronograma de actividades realizadas",
    "7. Entrevistas con expertos en el área",
    "8. Documentos normativos y marcos legales",
    "9. Glosario de términos técnicos especializados",
    "10. Casos de estudio complementarios"
  ];

  // Personalizar según el tema
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('educación') || topicLower.includes('enseñanza') || topicLower.includes('aprendizaje')) {
    return [
      "1. Planes de sesión educativas implementadas",
      "2. Rúbricas y instrumentos de evaluación",
      "3. Fotografías de actividades pedagógicas",
      "4. Resultados de evaluaciones estudiantiles",
      "5. Materiales didácticos utilizados",
      "6. Entrevistas con docentes participantes",
      "7. Encuestas de satisfacción educativa",
      "8. Cronograma de implementación curricular",
      "9. Marco normativo educativo aplicado",
      "10. Casos de éxito en el proceso educativo"
    ].join('\n');
  } else if (topicLower.includes('empresa') || topicLower.includes('negocio') || topicLower.includes('comercio')) {
    return [
      "1. Estados financieros y reportes económicos",
      "2. Organigramas y estructuras organizacionales", 
      "3. Análisis FODA de la organización",
      "4. Encuestas de clima organizacional",
      "5. Fotografías de instalaciones y procesos",
      "6. Entrevistas con directivos y empleados",
      "7. Documentos de políticas empresariales",
      "8. Indicadores de rendimiento (KPIs)",
      "9. Cronograma de implementación estratégica",
      "10. Casos de estudio de empresas similares"
    ].join('\n');
  } else if (topicLower.includes('salud') || topicLower.includes('médico') || topicLower.includes('hospital')) {
    return [
      "1. Protocolos médicos y guías clínicas",
      "2. Datos estadísticos epidemiológicos",
      "3. Instrumentos de evaluación clínica",
      "4. Fotografías de equipamiento médico",
      "5. Entrevistas con profesionales de salud",
      "6. Historiales clínicos anonimizados",
      "7. Normativas sanitarias aplicables",
      "8. Cronograma de intervenciones médicas",
      "9. Resultados de análisis de laboratorio",
      "10. Casos clínicos representativos"
    ].join('\n');
  } else if (topicLower.includes('tecnología') || topicLower.includes('software') || topicLower.includes('digital')) {
    return [
      "1. Diagramas de arquitectura del sistema",
      "2. Código fuente de módulos principales",
      "3. Capturas de pantalla de interfaces",
      "4. Resultados de pruebas de rendimiento",
      "5. Documentación técnica especializada",
      "6. Entrevistas con desarrolladores",
      "7. Especificaciones técnicas del proyecto",
      "8. Cronograma de desarrollo implementado",
      "9. Métricas de calidad del software",
      "10. Casos de uso del sistema desarrollado"
    ].join('\n');
  }
  
  return baseSuggestions.join('\n');
}