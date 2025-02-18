// src/services/DocumentService.jsx

// URL FORZADA PARA PRODUCCIÓN - NO USAR VARIABLES DE ENTORNO
const API_URL = "https://academico3-production.up.railway.app";
console.log("🚀 API URL (FORZADA EN CÓDIGO):", API_URL);

class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
    this.baseURL = API_URL;
    console.log("🌐 URL de API configurada:", this.baseURL);
  }

  async generateIndex(data) {
    try {
      const url = `${this.baseURL}/api/generate-index`;
      console.log("🔍 URL DE SOLICITUD USADA:", url);
      console.log("📦 Payload:", JSON.stringify(data));

      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      console.log("📡 Respuesta status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error del servidor:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();
      return result.index;
    } catch (error) {
      console.error("🚨 Error completo:", error);
      throw error;
    }
  }

  // Si tienes este método, asegúrate de que también use la URL forzada
  async generateDocument(formData) {
    try {
      const response = await fetch(`${this.baseURL}/api/generate-document`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error("Error al generar documento:", error);
      throw error;
    }
  }

  downloadDocument(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export default new DocumentService();
