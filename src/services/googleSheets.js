// src/services/googleSheets.js
// Define la URL de la API - ajústala según tu entorno
const API_URL = "https://academico3.vercel.app/api";
// Si estás trabajando localmente y quieres apuntar a producción, usa:
// const API_URL = "https://academico3.onrender.com/api";

export async function appendToSheet(data) {
  try {
    console.log("Enviando datos al servidor:", data);

    // Usar la URL completa para asegurarnos de que apunta al lugar correcto
    const response = await fetch(`${API_URL}/append-to-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Manejo de respuesta no exitosa
    if (!response.ok) {
      let errorMessage;
      try {
        // Intenta leer el cuerpo de error como JSON
        const errorData = await response.json();
        errorMessage =
          errorData.error || `Error ${response.status}: ${response.statusText}`;
      } catch (_) {
        // Si no es JSON, usa el texto de error o el status
        try {
          const errorText = await response.text();
          errorMessage =
            errorText || `Error ${response.status}: ${response.statusText}`;
        } catch (_) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      }

      throw new Error(errorMessage);
    }

    // Si la respuesta está vacía o no tiene contenido
    if (
      !response.headers.get("content-length") ||
      response.headers.get("content-length") === "0"
    ) {
      return { success: true };
    }

    // Intentar parsear la respuesta como JSON
    try {
      const result = await response.json();
      console.log("Respuesta del servidor:", result);
      return result;
    } catch (_) {
      // Si no se puede parsear como JSON, devolver éxito genérico
      console.warn("No se pudo parsear la respuesta como JSON");
      return { success: true, warning: "No se pudo parsear la respuesta" };
    }
  } catch (error) {
    console.error("Error en appendToSheet:", error);
    throw error; // Propagar el error para que la UI pueda manejarlo
  }
}
