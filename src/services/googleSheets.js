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
      // Mapear directamente a los nombres de columnas en la hoja de cálculo
      dataToSend.Caratula = dataToSend.coverData.incluirCaratula ? "Sí" : "No";
      dataToSend["Tipo Institucion"] =
        dataToSend.coverData.tipoInstitucion || "";
      dataToSend.Plantilla = dataToSend.coverData.templateStyle || "";

      // Según el tipo de institución, extraer campos específicos
      if (dataToSend.coverData.tipoInstitucion === "colegio") {
        dataToSend.Institucion = dataToSend.coverData.nombreColegio || "";
        dataToSend["Titulo Trabajo"] =
          dataToSend.coverData.tituloTrabajoColegio || "";

        // Extraer nombres de estudiantes como una cadena separada por comas
        if (
          dataToSend.coverData.estudiantesColegio &&
          dataToSend.coverData.estudiantesColegio.length > 0
        ) {
          dataToSend.Estudiantes = dataToSend.coverData.estudiantesColegio
            .map((est) => est.nombre)
            .filter(Boolean)
            .join(", ");
        }
      } else if (dataToSend.coverData.tipoInstitucion === "universidad") {
        dataToSend.Institucion = dataToSend.coverData.nombreUniversidad || "";
        dataToSend["Titulo Trabajo"] =
          dataToSend.coverData.tituloTrabajoUniversidad || "";
        dataToSend.Facultad = dataToSend.coverData.facultad || "";

        if (
          dataToSend.coverData.estudiantesUniversidad &&
          dataToSend.coverData.estudiantesUniversidad.length > 0
        ) {
          dataToSend.Estudiantes = dataToSend.coverData.estudiantesUniversidad
            .map((est) => est.nombre)
            .filter(Boolean)
            .join(", ");
        }
      } else if (dataToSend.coverData.tipoInstitucion === "instituto") {
        dataToSend.Institucion = dataToSend.coverData.nombreInstituto || "";
        dataToSend["Titulo Trabajo"] =
          dataToSend.coverData.tituloTrabajoInstituto || "";

        if (
          dataToSend.coverData.estudiantesInstituto &&
          dataToSend.coverData.estudiantesInstituto.length > 0
        ) {
          dataToSend.Estudiantes = dataToSend.coverData.estudiantesInstituto
            .map((est) => est.nombre)
            .filter(Boolean)
            .join(", ");
        }
      }

      // Generar un JSON limpio y bien estructurado para la columna Detalles JSON
      try {
        // Crear un objeto simplificado con solo la información esencial
        const detallesJSON = {
          incluirCaratula: dataToSend.coverData.incluirCaratula,
          tipoInstitucion: dataToSend.coverData.tipoInstitucion,
          templateStyle: dataToSend.coverData.templateStyle,
        };

        // Añadir los campos específicos según el tipo de institución
        if (dataToSend.coverData.tipoInstitucion === "universidad") {
          detallesJSON.nombreUniversidad =
            dataToSend.coverData.nombreUniversidad || "";
          detallesJSON.facultad = dataToSend.coverData.facultad || "";
          detallesJSON.tituloTrabajo =
            dataToSend.coverData.tituloTrabajoUniversidad || "";
          detallesJSON.estudiantes = dataToSend.Estudiantes || "";
        } else if (dataToSend.coverData.tipoInstitucion === "colegio") {
          detallesJSON.nombreColegio = dataToSend.coverData.nombreColegio || "";
          detallesJSON.tituloTrabajo =
            dataToSend.coverData.tituloTrabajoColegio || "";
          detallesJSON.estudiantes = dataToSend.Estudiantes || "";
        } else if (dataToSend.coverData.tipoInstitucion === "instituto") {
          detallesJSON.nombreInstituto =
            dataToSend.coverData.nombreInstituto || "";
          detallesJSON.tituloTrabajo =
            dataToSend.coverData.tituloTrabajoInstituto || "";
          detallesJSON.estudiantes = dataToSend.Estudiantes || "";
        }

        // Convertir a una cadena JSON simplificada (sin formato para reducir espacio)
        dataToSend["Detalles JSON"] = JSON.stringify(detallesJSON);
      } catch (e) {
        console.error("Error generando JSON de detalles:", e);
        dataToSend["Detalles JSON"] = "Error al generar detalles";
      }

      // Eliminar el objeto complejo original para evitar duplicación de datos
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
