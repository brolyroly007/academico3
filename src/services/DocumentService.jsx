// src/services/DocumentService.js
import { handleError } from "../utils/errorHandler";
const API_URL = import.meta.env.VITE_API_URL;
class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
      "X-API-Key": import.meta.env.VITE_API_KEY,
      "anthropic-version": "2023-06-01",
    };
  }

  async generateIndex(data) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Genera un índice para un ${data.documentType} sobre ${data.topic} con formato ${data.citationFormat}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.content;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  async generateDocument(formData) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Genera un documento de tipo ${formData.get(
                "documentType"
              )} usando el índice: ${formData.get("indiceModificado")}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      handleError(error);
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
