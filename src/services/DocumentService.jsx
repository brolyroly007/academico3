// src/services/DocumentService.jsx
const API_URL = "https://academico3.onrender.com";
console.log("🚀 API URL:", API_URL);

class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
    this.baseURL = API_URL;
  }

  async generateIndex(data) {
    try {
      console.log("🔍 URL completa:", `${this.baseURL}/api/generate-index`);
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
