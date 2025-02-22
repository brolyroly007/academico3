// src/services/DocumentService.jsx
class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
    // URL base para la API
    this.baseURL =
      import.meta.env.VITE_API_URL || "https://academico3.vercel.app/api";
  }

  async generateIndex(formData) {
    try {
      // Primero intentamos generar el índice usando la API
      const response = await fetch(`${this.baseURL}/api/generate-index`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      const result = await response.json();
      return result.index;
    } catch (error) {
      console.warn("Usando generación local del índice debido a:", error);
      return this.generateLocalIndex(formData);
    }
  }

  generateLocalIndex(formData) {
    const {
      documentType,
      topic,
      indexStructure,
      length,
      course,
      career,
      essayTone,
    } = formData;

    // Convertir el tema a título
    const title = topic.toUpperCase();
    let index = "";

    // Determinar la profundidad basada en la longitud
    const isLongDocument = length === "largo";

    switch (indexStructure) {
      case "academica":
        index = `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación y relevancia en ${career}
   1.3 Objetivos del estudio para ${course}

II. MARCO TEÓRICO
   2.1 Antecedentes de investigación
   2.2 Bases teóricas
   2.3 Marco conceptual${isLongDocument ? "\n   2.4 Estado del arte" : ""}

III. METODOLOGÍA
   3.1 Enfoque metodológico
   3.2 Diseño de investigación
   3.3 Técnicas e instrumentos${
     isLongDocument ? "\n   3.4 Procedimientos de análisis" : ""
   }

IV. DESARROLLO Y ANÁLISIS
   4.1 Presentación de resultados
   4.2 Análisis e interpretación
   4.3 Discusión de hallazgos${
     isLongDocument ? "\n   4.4 Implicaciones teóricas y prácticas" : ""
   }

V. CONCLUSIONES Y RECOMENDACIONES
   5.1 Conclusiones principales
   5.2 Recomendaciones
   ${
     isLongDocument
       ? "5.3 Limitaciones del estudio\n   5.4 Futuras líneas de investigación"
       : ""
   }

VI. REFERENCIAS BIBLIOGRÁFICAS`;
        break;

      case "capitulos":
        index = `${title}

CAPÍTULO I: ASPECTOS INTRODUCTORIOS
   1.1 Contextualización del tema en ${course}
   1.2 Objetivos del estudio
   1.3 Importancia en el contexto de ${career}

CAPÍTULO II: FUNDAMENTACIÓN TEÓRICA
   2.1 Marco teórico
   2.2 Revisión de literatura${
     isLongDocument ? "\n   2.3 Debates actuales" : ""
   }

CAPÍTULO III: METODOLOGÍA Y DESARROLLO
   3.1 Diseño metodológico
   3.2 Análisis del tema
   3.3 Hallazgos principales${
     isLongDocument ? "\n   3.4 Interpretación detallada" : ""
   }

CAPÍTULO IV: RESULTADOS Y DISCUSIÓN
   4.1 Presentación de resultados
   4.2 Análisis crítico
   4.3 Implicaciones${isLongDocument ? "\n   4.4 Proyecciones futuras" : ""}

CAPÍTULO V: CONCLUSIONES
   5.1 Síntesis de hallazgos
   5.2 Recomendaciones${isLongDocument ? "\n   5.3 Perspectivas futuras" : ""}

REFERENCIAS BIBLIOGRÁFICAS`;
        break;

      default: // estructura estándar
        const toneAdjective = this.getToneAdjective(essayTone);
        index = `${title}

1. INTRODUCCIÓN
   1.1 Contextualización del tema
   1.2 Objetivos del ${documentType}
   1.3 Relevancia en ${course}

2. DESARROLLO
   2.1 ${toneAdjective} del marco conceptual
   2.2 Análisis principal
   2.3 Argumentación${isLongDocument ? "\n   2.4 Perspectivas adicionales" : ""}
   ${isLongDocument ? "2.5 Implicaciones para " + career : ""}

3. CONCLUSIONES
   3.1 Síntesis de ideas principales
   3.2 Reflexiones finales${
     isLongDocument ? "\n   3.3 Proyecciones futuras" : ""
   }

4. REFERENCIAS BIBLIOGRÁFICAS`;
    }

    return index;
  }

  getToneAdjective(tone) {
    const toneMap = {
      académico: "Exposición académica",
      analítico: "Análisis crítico",
      narrativo: "Descripción narrativa",
      formal: "Presentación formal",
    };
    return toneMap[tone.toLowerCase()] || "Presentación";
  }
}

export default new DocumentService();
