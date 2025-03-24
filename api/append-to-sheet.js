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
    const RANGE = "Hoja 1!A:U"; // Ampliamos el rango para más columnas

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

    // Extraer campos de carátula (si existen)
    const incluirCaratula = req.body.incluirCaratula || false;
    const tipoInstitucion = req.body.tipoInstitucion || "";
    const templateStyle = req.body.templateStyle || "";
    const nombreInstitucion = req.body.nombreInstitucion || "";
    const tituloTrabajo = req.body.tituloTrabajo || "";
    const estudiantes = req.body.estudiantes || "";
    const facultad = req.body.facultad || "";
    const coverDetailsJSON = req.body.coverDetailsJSON || "";

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
        incluirCaratula ? "Sí" : "No",
        tipoInstitucion,
        templateStyle,
        nombreInstitucion,
        tituloTrabajo,
        estudiantes,
        facultad,
        coverDetailsJSON,
      ],
    ];

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
          // Colorear las celdas de carátula si está habilitada
          incluirCaratula
            ? {
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
                            backgroundColor: { red: 0.8, green: 0.9, blue: 1 },
                          },
                        },
                      ],
                    },
                  ],
                  fields: "userEnteredFormat.backgroundColor",
                },
              }
            : null,
        ].filter(Boolean), // Eliminar nulls
      },
    });

    return res.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error en append-to-sheet:", error);
    return res.status(500).json({ error: error.message });
  }
}
