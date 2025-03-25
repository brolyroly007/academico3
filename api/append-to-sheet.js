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
    const RANGE = "Hoja 1!A:X"; // Rango ampliado para incluir todas las columnas

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

    // Extraer datos de carátula - buscar en múltiples formatos de nombres
    const caratula = req.body.Caratula || req.body.caratula || "No";
    const tipoInstitucion =
      req.body["Tipo Institucion"] ||
      req.body.tipoInstitucion ||
      req.body["Tipo Institución"] ||
      "";
    const plantilla = req.body.Plantilla || req.body.plantilla || "";
    const institucion =
      req.body.Institucion ||
      req.body.institucion ||
      req.body["Institución"] ||
      "";
    const tituloTrabajo =
      req.body["Titulo Trabajo"] ||
      req.body.tituloTrabajo ||
      req.body["Título Trabajo"] ||
      "";
    const estudiantes = req.body.Estudiantes || req.body.estudiantes || "";
    const facultad = req.body.Facultad || req.body.facultad || "";

    // Procesar datos JSON
    let detallesJSON = "{}";
    try {
      // Obtener el JSON desde la solicitud
      const jsonData =
        req.body["Detalles JSON"] || req.body.detallesJSON || "{}";

      // Asegurarse de que es una cadena de texto
      if (typeof jsonData === "string") {
        detallesJSON = jsonData;
      } else {
        // Si es un objeto, convertirlo a cadena JSON
        detallesJSON = JSON.stringify(jsonData);
      }

      // Limitar la longitud para evitar problemas con Google Sheets
      if (detallesJSON.length > 50000) {
        detallesJSON = detallesJSON.substring(0, 50000) + "... [truncado]";
      }
    } catch (e) {
      console.error("Error procesando JSON:", e);
      detallesJSON = `{"error": "Error al procesar JSON: ${e.message}"}`;
    }

    // Preparar los datos para insertar
    const values = [
      [
        nextId,
        new Date().toISOString(),
        req.body.documentType,
        req.body.topic,
        req.body.citationFormat,
        req.body.length,
        req.body.course,
        req.body.career,
        req.body.essayTone,
        req.body.additionalInfo,
        req.body.index,
        req.body.name,
        `${req.body.countryCode}${req.body.phoneNumber}`,
        "Pendiente",
        "",
        "",
        // Datos de carátula
        caratula,
        tipoInstitucion,
        plantilla,
        institucion,
        tituloTrabajo,
        estudiantes,
        facultad,
        detallesJSON,
      ],
    ];

    console.log("Enviando datos a la hoja:", values[0].slice(0, 8)); // Log parcial para no saturar la consola

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
          // Formato para Status
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 13,
                endColumnIndex: 14,
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
          // Formato para Índice
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
          // Formato para Carátula si es "Sí"
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
          // Formato para texto largo en Detalles JSON
          {
            updateCells: {
              range: {
                sheetId: 0,
                startRowIndex: rowIndex,
                endRowIndex: rowIndex + 1,
                startColumnIndex: 23,
                endColumnIndex: 24,
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
        ],
      },
    });

    return res.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error en append-to-sheet:", error);
    return res.status(500).json({ error: error.message });
  }
}
