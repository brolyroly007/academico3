const API_URL = import.meta.env.VITE_API_URL;
console.log("Current API_URL:", API_URL);

class DocumentService {
  constructor() {
    console.log("DocumentService initialized with URL:", API_URL);
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async generateIndex(data) {
    try {
      console.log("Generating index with URL:", API_URL);
      console.log("Sending data:", data);

      const response = await fetch(`${API_URL}/api/generate-index`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Index generated:", result);
      return result.index;
    } catch (error) {
      console.error("Error generating index:", error);
      throw error;
    }
  }

  async generateDocument(formData) {
    try {
      console.log("Generating document with URL:", API_URL);
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
      console.error("Error generating document:", error);
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
