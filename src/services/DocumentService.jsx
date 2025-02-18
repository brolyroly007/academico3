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
      // Prueba de conexión primero
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error("No se pudo establecer conexión con el backend");
      }

      console.log("🔍 URL completa:", `${this.baseURL}/api/generate-index`);
      console.log("📦 Payload completo:", JSON.stringify(data));

      const response = await fetch(`${this.baseURL}/api/generate-index`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        mode: "cors",
        cache: "no-cache",
      });

      console.log("📡 Respuesta status:", response.status);

      const responseText = await response.text();
      console.log("📄 Respuesta texto completo:", responseText);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${responseText}`
        );
      }

      const result = JSON.parse(responseText);
      console.log("✅ Resultado parseado:", result);

      return result.index;
    } catch (error) {
      console.error("🚨 Error completo:", error);
      console.error("🚨 Tipo de error:", error.name);
      console.error("🚨 Mensaje de error:", error.message);
      throw error;
    }
  }
}

export default new DocumentService();
