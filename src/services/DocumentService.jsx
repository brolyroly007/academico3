import { handleError } from "../utils/errorHandler";
const API_URL = import.meta.env.VITE_API_URL;

class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async generateIndex(data) {
    try {
      console.log("Using API URL:", API_URL);
      const response = await fetch(`${API_URL}/api/generate-index`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.index;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }

  async generateDocument(formData) {
    try {
      const response = await fetch(`${API_URL}/api/generate-document`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          documentType: formData.get("documentType"),
          index: formData.get("indiceModificado"),
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
