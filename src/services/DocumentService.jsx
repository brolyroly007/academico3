const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://academico3-production.up.railway.app";
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
        headers: {
          ...this.headers,
          Origin: window.location.origin,
        },
        body: JSON.stringify(data),
        mode: "cors",
        credentials: "same-origin",
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
