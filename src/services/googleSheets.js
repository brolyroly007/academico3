// src/services/googleSheets.js
const API_URL = "https://academico3.onrender.com";

export async function appendToSheet(data) {
  try {
    console.log("API URL siendo usada:", API_URL);
    console.log("Enviando datos al servidor:", data);

    const response = await fetch(`${API_URL}/api/append-to-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(errorText || "Error al guardar en Google Sheets");
    }

    const result = await response.json();
    console.log("Respuesta del servidor:", result);
    return result;
  } catch (error) {
    console.error("Error en appendToSheet:", error);
    throw error;
  }
}
