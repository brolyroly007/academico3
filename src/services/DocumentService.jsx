const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://academico3-production.up.railway.app";
console.log("Using API URL:", API_URL);

class DocumentService {
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  async generateIndex(data) {
    try {
      console.log("Request:", { data, url: `${API_URL}/api/generate-index` });
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
      console.error("Error:", error);
      throw error;
    }
  }

  async generateDocument(formData) {
    try {
      console.log("Generating document with:", { formData, url: API_URL });
      const response = await fetch(`${API_URL}/api/generate-document`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          documentType: formData.get("documentType"),
          index: formData.get("indiceModificado"),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
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
