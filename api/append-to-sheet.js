import { google } from "googleapis";

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Manejar solicitudes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Validar que sea una solicitud POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    console.log("Datos recibidos en append-to-sheet:", req.body);

    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
    if (!SPREADSHEET_ID) {
      throw new Error("GOOGLE_SHEETS_ID no configurado");
    }

    // Configurar la autenticación de Google
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(
        process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"
      ),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const RANGE = "Hoja 1!A:AD"; // Rango ampliado para incluir todas las columnas (AD)

    // Obtener el último ID para generar uno nuevo
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Hoja 1!A:A",
    });

    let nextId = 1;
    if (response.data.values?.length > 1) {
      const lastId = response.data.values[response.data.values.length - 1][0];
      nextId = parseInt(lastId) + 1;
    }

    // Procesar datos JSON
    let detallesJSON = "{}";
    try {
      // Si existe coverData como objeto, usar directamente
      if (req.body.coverData && typeof req.body.coverData === "object") {
        detallesJSON = JSON.stringify(req.body.coverData);

        // Limitar longitud para Google Sheets
        if (detallesJSON.length > 50000) {
          detallesJSON = detallesJSON.substring(0, 50000) + "... [truncado]";
        }
      } else if (typeof req.body["Detalles JSON"] === "string") {
        // Si ya viene como string, usarlo directamente
        detallesJSON = req.body["Detalles JSON"];
      }
    } catch (e) {
      console.error("Error procesando JSON:", e);
      detallesJSON = `{"error": "Error al procesar JSON: ${e.message}"}`;
    }

    // Extraer datos de carátula - buscar en múltiples formatos de nombres
    const caratula =
      req.body.Caratula ||
      req.body.caratula ||
      (req.body.coverData?.incluirCaratula ? "Sí" : "No");
    const tipoInstitucion =
      req.body["Tipo Institucion"] ||
      req.body.tipoInstitucion ||
      req.body["Tipo Institución"] ||
      req.body.coverData?.tipoInstitucion ||
      "";
    const plantilla =
      req.body.Plantilla ||
      req.body.plantilla ||
      req.body.coverData?.templateStyle ||
      "";

    // Determinar la institución según el tipo
    let institucion = "";
    if (tipoInstitucion === "colegio") {
      institucion = req.body.coverData?.nombreColegio || "";
    } else if (tipoInstitucion === "universidad") {
      institucion = req.body.coverData?.nombreUniversidad || "";
    } else if (tipoInstitucion === "instituto") {
      institucion = req.body.coverData?.nombreInstituto || "";
    }

    // Determinar el título del trabajo según el tipo
    let tituloTrabajo = "";
    if (tipoInstitucion === "colegio") {
      tituloTrabajo = req.body.coverData?.tituloTrabajoColegio || "";
    } else if (tipoInstitucion === "universidad") {
      tituloTrabajo = req.body.coverData?.tituloTrabajoUniversidad || "";
    } else if (tipoInstitucion === "instituto") {
      tituloTrabajo = req.body.coverData?.tituloTrabajoInstituto || "";
    }

    // Determinar la facultad (solo para universidad)
    const facultad =
      tipoInstitucion === "universidad"
        ? req.body.coverData?.facultad || ""
        : "";

    // Extraer docente según tipo de institución
    let docente = "";
    if (tipoInstitucion === "colegio") {
      docente = req.body.coverData?.docenteColegio || "";
    } else if (tipoInstitucion === "universidad") {
      docente = req.body.coverData?.docenteUniversidad || "";
    } else if (tipoInstitucion === "instituto") {
      docente = req.body.coverData?.docenteInstituto || "";
    }

    // Extraer nombres de estudiantes como una cadena separada por comas
    let estudiantes = "";
    let codigosEstudiantes = "";
    try {
      if (
        tipoInstitucion === "colegio" &&
        req.body.coverData?.estudiantesColegio?.length > 0
      ) {
        estudiantes = req.body.coverData.estudiantesColegio
          .map((est) => est.nombre)
          .filter(Boolean)
          .join(", ");

        // Extraer códigos de estudiantes (números de orden para colegio)
        codigosEstudiantes = req.body.coverData.estudiantesColegio
          .map((est) => est.orden)
          .filter(Boolean)
          .join(", ");
      } else if (
        tipoInstitucion === "universidad" &&
        req.body.coverData?.estudiantesUniversidad?.length > 0
      ) {
        estudiantes = req.body.coverData.estudiantesUniversidad
          .map((est) => est.nombre)
          .filter(Boolean)
          .join(", ");

        // Extraer códigos de estudiantes
        codigosEstudiantes = req.body.coverData.estudiantesUniversidad
          .map((est) => est.codigo)
          .filter(Boolean)
          .join(", ");
      } else if (
        tipoInstitucion === "instituto" &&
        req.body.coverData?.estudiantesInstituto?.length > 0
      ) {
        estudiantes = req.body.coverData.estudiantesInstituto
          .map((est) => est.nombre)
          .filter(Boolean)
          .join(", ");

        // Extraer códigos de estudiantes
        codigosEstudiantes = req.body.coverData.estudiantesInstituto
          .map((est) => est.codigo)
          .filter(Boolean)
          .join(", ");
      }
    } catch (e) {
      console.error("Error procesando estudiantes:", e);
    }

    // Extraer grado y sección (solo para colegio)
    let grado = "";
    let seccion = "";
    if (tipoInstitucion === "colegio") {
      grado = req.body.coverData?.gradoColegio || "";
      seccion = req.body.coverData?.seccionColegio || "";
    }

    // Extraer programa (solo para instituto)
    let programa = "";
    if (tipoInstitucion === "instituto") {
      programa = req.body.coverData?.programaInstituto || "";
    } else if (tipoInstitucion === "universidad") {
      programa = req.body.coverData?.carreraUniversidad || "";
    }

    // Obtener estructura del índice
    const indexStructure = req.body.indexStructure || "estandar";

    // Preparar los datos para insertar - Orden actualizado con nuevas columnas
    const values = [
      [
        nextId, // A - ID
        new Date().toISOString(), // B - Fecha
        req.body.documentType, // C - Tipo
        req.body.topic, // D - Tema
        req.body.citationFormat, // E - Formato
        req.body.length, // F - Longitud
        req.body.course, // G - Curso
        req.body.career, // H - Carrera
        req.body.essayTone, // I - Tono
        indexStructure, // J - Estructura Índice
        req.body.additionalInfo, // K - Instrucciones
        req.body.index, // L - Índice
        req.body.name, // M - Contacto
        `${req.body.countryCode}${req.body.phoneNumber}`, // N - WhatsApp
        "Pendiente", // O - Status
        "Pendiente", // P - Estado Notificación
        nextId.toString(), // Q - Código de Pedido
        caratula, // R - Carátula
        tipoInstitucion, // S - Tipo Institución
        plantilla, // T - Plantilla
        institucion, // U - Institución
        tituloTrabajo, // V - Título Trabajo
        estudiantes, // W - Estudiantes
        facultad, // X - Facultad
        docente, // Y - Docente (NUEVO)
        codigosEstudiantes, // Z - Códigos Estudiantes (NUEVO)
        grado, // AA - Grado (NUEVO)
        seccion, // AB - Sección (NUEVO)
        programa, // AC - Programa (NUEVO)
        detallesJSON, // AD - Detalles JSON
      ],
    ];

    console.log("Enviando datos a la hoja:", values[0].slice(0, 10)); // Log parcial

    // Añadir los datos a la hoja
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    // Formatear la fila recién insertada
    const rowIndex = result.data.updates.updatedRange.match(/\d+/)[0] - 1;
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          // Formato para Status (ahora en columna O - índice 14)
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 14,
                endColumnIndex: 15,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        backgroundColor: { red: 1, green: 1, blue: 0 },
                      },
                    },
                  ],
                },
              ],
              fields: "userEnteredFormat.backgroundColor",
            },
          },
          // Formato para Estructura Índice (columna J - índice 9)
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 9,
                endColumnIndex: 10,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        backgroundColor:
                          indexStructure === "estandar"
                            ? { red: 0.82, green: 0.88, blue: 0.99 } // Azul claro
                            : indexStructure === "capitulos"
                            ? { red: 0.99, green: 0.91, blue: 0.82 } // Naranja claro
                            : { red: 0.88, green: 0.82, blue: 0.99 }, // Lavanda claro
                      },
                    },
                  ],
                },
              ],
              fields: "userEnteredFormat.backgroundColor",
            },
          },
          // Formato para Índice (ahora en columna L - índice 11)
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 11,
                endColumnIndex: 12,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        wrapStrategy: "WRAP",
                        verticalAlignment: "TOP",
                      },
                    },
                  ],
                },
              ],
              fields: "userEnteredFormat(wrapStrategy,verticalAlignment)",
            },
          },
          // Formato para Carátula (ahora en columna R - índice 17)
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 17,
                endColumnIndex: 18,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        backgroundColor:
                          caratula === "Sí"
                            ? { red: 0.8, green: 0.9, blue: 0.8 } // Verde claro si es Sí
                            : { red: 0.95, green: 0.95, blue: 0.95 }, // Gris claro si es No
                      },
                    },
                  ],
                },
              ],
              fields: "userEnteredFormat.backgroundColor",
            },
          },
          // Formato para Docente (columna Y - índice 24)
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 24,
                endColumnIndex: 25,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        wrapStrategy: "WRAP",
                        verticalAlignment: "TOP",
                      },
                    },
                  ],
                },
              ],
              fields: "userEnteredFormat(wrapStrategy,verticalAlignment)",
            },
          },
          // Formato para texto largo en Detalles JSON (ahora en columna AD - índice 29)
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 29,
                endColumnIndex: 30,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        wrapStrategy: "WRAP",
                        verticalAlignment: "TOP",
                        textFormat: {
                          foregroundColor: { red: 0.4, green: 0.4, blue: 0.4 }, // Gris para mejor legibilidad
                          fontSize: 8, // Tamaño más pequeño para el JSON
                        },
                      },
                    },
                  ],
                },
              ],
              fields:
                "userEnteredFormat(wrapStrategy,verticalAlignment,textFormat)",
            },
          },
          // Formato para Código de Pedido (ahora en columna Q - índice 16)
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 16,
                endColumnIndex: 17,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        horizontalAlignment: "CENTER",
                        textFormat: {
                          bold: true,
                        },
                      },
                    },
                  ],
                },
              ],
              fields: "userEnteredFormat(horizontalAlignment,textFormat)",
            },
          },
          // Formato para Instrucciones (columna K - índice 10)
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 10,
                endColumnIndex: 11,
              },
              rows: [
                {
                  values: [
                    {
                      userEnteredFormat: {
                        wrapStrategy: "WRAP",
                        verticalAlignment: "TOP",
                      },
                    },
                  ],
                },
              ],
              fields: "userEnteredFormat(wrapStrategy,verticalAlignment)",
            },
          },
        ],
      },
    });

    return res.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error en append-to-sheet:", error);
    return res.status(500).json({ error: error.message });
  }
}
