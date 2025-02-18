// src/services/DocumentService.jsx
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://academico3-production.up.railway.app";

class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
    this.baseURL = API_URL;
    console.log("🚀 API URL configurada en DocumentService:", this.baseURL);
  }

  async generateIndex(data) {
    try {
      console.log(
        "🔍 URL completa para generate-index:",
        `${this.baseURL}/api/generate-index`
      );
      console.log("📦 Payload:", JSON.stringify(data));

      const response = await fetch(`${this.baseURL}/api/generate-index`, {
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
}

export default new DocumentService();
