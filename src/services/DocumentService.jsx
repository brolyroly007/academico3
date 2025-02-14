const API_URL = "https://academico3-production.up.railway.app";
console.log("🚀 API URL:", API_URL);

class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
    this.baseURL = API_URL;
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/api/health`, {
        method: "GET",
        headers: this.headers,
      });
      console.log("🔗 Health Check Response:", await response.json());
      return response.ok;
    } catch (error) {
      console.error("❌ Health Check Error:", error);
      return false;
    }
  }

  async generateIndex(data) {
    try {
      // Primero, prueba la conexión
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error("No se pudo establecer conexión con el backend");
      }

      console.log("🔍 URL completa:", `${this.baseURL}/api/generate-index`);
      const response = await fetch(`${this.baseURL}/api/generate-index`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
        mode: "cors",
        cache: "no-cache",
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
