// src/services/googleSheets.js
// Define la URL de la API - ajústala según tu entorno
const API_URL = "https://academico3.vercel.app/api";
// Si estás trabajando localmente y quieres apuntar a producción, usa:
// const API_URL = "https://academico3.onrender.com/api";

export async function appendToSheet(data) {
  try {
    console.log("Enviando datos al servidor:", data);

    // Crear una copia profunda de los datos para no mutar el original
    const dataToSend = JSON.parse(JSON.stringify(data));

    // Procesar los datos de carátula para el envío
    if (dataToSend.coverData) {
      // Extraer información básica de carátula a campos de primer nivel
      dataToSend.incluirCaratula =
        dataToSend.coverData.incluirCaratula || false;
      dataToSend.tipoInstitucion = dataToSend.coverData.tipoInstitucion || "";
      dataToSend.templateStyle = dataToSend.coverData.templateStyle || "";

      // Según el tipo de institución, extraer campos específicos
      if (dataToSend.coverData.tipoInstitucion === "colegio") {
        dataToSend.nombreInstitucion = dataToSend.coverData.nombreColegio || "";
        dataToSend.tituloTrabajo =
          dataToSend.coverData.tituloTrabajoColegio || "";

        // Extraer nombres de estudiantes como una cadena separada por comas
        if (
          dataToSend.coverData.estudiantesColegio &&
          dataToSend.coverData.estudiantesColegio.length > 0
        ) {
          dataToSend.estudiantes = dataToSend.coverData.estudiantesColegio
            .map((est) => est.nombre)
            .filter(Boolean)
            .join(", ");
        }
      } else if (dataToSend.coverData.tipoInstitucion === "universidad") {
        dataToSend.nombreInstitucion =
          dataToSend.coverData.nombreUniversidad || "";
        dataToSend.tituloTrabajo =
          dataToSend.coverData.tituloTrabajoUniversidad || "";
        dataToSend.facultad = dataToSend.coverData.facultad || "";

        if (
          dataToSend.coverData.estudiantesUniversidad &&
          dataToSend.coverData.estudiantesUniversidad.length > 0
        ) {
          dataToSend.estudiantes = dataToSend.coverData.estudiantesUniversidad
            .map((est) => est.nombre)
            .filter(Boolean)
            .join(", ");
        }
      } else if (dataToSend.coverData.tipoInstitucion === "instituto") {
        dataToSend.nombreInstitucion =
          dataToSend.coverData.nombreInstituto || "";
        dataToSend.tituloTrabajo =
          dataToSend.coverData.tituloTrabajoInstituto || "";

        if (
          dataToSend.coverData.estudiantesInstituto &&
          dataToSend.coverData.estudiantesInstituto.length > 0
        ) {
          dataToSend.estudiantes = dataToSend.coverData.estudiantesInstituto
            .map((est) => est.nombre)
            .filter(Boolean)
            .join(", ");
        }
      }

      // Convertir objetos complejos a cadenas JSON
      dataToSend.coverDetailsJSON = JSON.stringify(dataToSend.coverData);

      // Eliminar objetos complejos y archivos que no pueden enviarse a la API
      delete dataToSend.coverData;
    }

    console.log("Datos procesados para enviar:", dataToSend);

    // Usar la URL completa para asegurarnos de que apunta al lugar correcto
    const response = await fetch(`${API_URL}/append-to-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
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
