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

    // CAMBIO IMPORTANTE: Conservar todos los datos de la carátula en su forma original
    // en lugar de filtrarlos o extraerlos parcialmente

    if (dataToSend.coverData) {
      // Asegurarse de que coverData tenga la estructura correcta según el tipo de institución
      const tipoInstitucion = dataToSend.coverData.tipoInstitucion || "";

      // Mapear campos básicos a nivel superior para compatibilidad
      dataToSend.Caratula = dataToSend.coverData.incluirCaratula ? "Sí" : "No";
      dataToSend["Tipo Institucion"] = tipoInstitucion;
      dataToSend.Plantilla = dataToSend.coverData.templateStyle || "";

      // Mapear institución según tipo
      if (tipoInstitucion === "colegio") {
        dataToSend.Institucion = dataToSend.coverData.nombreColegio || "";
        dataToSend["Titulo Trabajo"] =
          dataToSend.coverData.tituloTrabajoColegio || "";
      } else if (tipoInstitucion === "universidad") {
        dataToSend.Institucion = dataToSend.coverData.nombreUniversidad || "";
        dataToSend["Titulo Trabajo"] =
          dataToSend.coverData.tituloTrabajoUniversidad || "";
        dataToSend.Facultad = dataToSend.coverData.facultad || "";
      } else if (tipoInstitucion === "instituto") {
        dataToSend.Institucion = dataToSend.coverData.nombreInstituto || "";
        dataToSend["Titulo Trabajo"] =
          dataToSend.coverData.tituloTrabajoInstituto || "";
      }

      // Nombres de estudiantes
      if (
        tipoInstitucion === "colegio" &&
        dataToSend.coverData.estudiantesColegio &&
        dataToSend.coverData.estudiantesColegio.length > 0
      ) {
        dataToSend.Estudiantes = dataToSend.coverData.estudiantesColegio
          .map((est) => est.nombre)
          .filter(Boolean)
          .join(", ");
      } else if (
        tipoInstitucion === "universidad" &&
        dataToSend.coverData.estudiantesUniversidad &&
        dataToSend.coverData.estudiantesUniversidad.length > 0
      ) {
        dataToSend.Estudiantes = dataToSend.coverData.estudiantesUniversidad
          .map((est) => est.nombre)
          .filter(Boolean)
          .join(", ");
      } else if (
        tipoInstitucion === "instituto" &&
        dataToSend.coverData.estudiantesInstituto &&
        dataToSend.coverData.estudiantesInstituto.length > 0
      ) {
        dataToSend.Estudiantes = dataToSend.coverData.estudiantesInstituto
          .map((est) => est.nombre)
          .filter(Boolean)
          .join(", ");
      }

      // IMPORTANTE: El objeto coverData original se mantendrá intacto
      // y se convertirá a JSON en el servidor
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
