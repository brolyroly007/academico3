// src/services/DocumentService.jsx
class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
    this.baseURL = import.meta.env.VITE_API_URL || "/api";
  }

  async generateIndex(formData) {
    try {
      // Log de datos que se envían
      console.log("DocumentService - Enviando datos:", {
        documentType: formData.documentType,
        topic: formData.topic,
        length: formData.length,
        indexStructure: formData.indexStructure,
        course: formData.course,
        career: formData.career,
        essayTone: formData.essayTone,
        additionalInfo: formData.additionalInfo,
      });

      const response = await fetch(`${this.baseURL}/generate-index`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          documentType: formData.documentType,
          topic: formData.topic,
          length: formData.length,
          indexStructure: formData.indexStructure,
          course: formData.course,
          career: formData.career,
          essayTone: formData.essayTone,
          additionalInfo: formData.additionalInfo,
        }),
      });

      console.log("Status respuesta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en respuesta:", errorText);
        throw new Error(`Error en la API: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("DocumentService - Índice recibido:", result);

      return result.index;
    } catch (error) {
      console.error("Error en DocumentService:", error);
      throw error; // Propagar el error para que el componente lo maneje
    }
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

  async downloadDocument(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async generateDocument(formData) {
    try {
      const response = await fetch(`${this.baseURL}/generate-document`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error generando documento: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Error en generación de documento:", error);
      throw error;
    }
  }
}

export default new DocumentService();
