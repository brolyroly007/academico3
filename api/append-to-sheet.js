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
    console.log("Procesando solicitud append-to-sheet");

    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
    if (!SPREADSHEET_ID) {
      console.error("GOOGLE_SHEETS_ID no configurado");
      throw new Error("GOOGLE_SHEETS_ID no configurado");
    }

    // Verificar credenciales
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.error("GOOGLE_APPLICATION_CREDENTIALS no configurado");
      throw new Error("GOOGLE_APPLICATION_CREDENTIALS no configurado");
    }

    // Intentar parsear las credenciales
    let credentials;
    try {
      credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      console.log("Credenciales parseadas correctamente");
    } catch (parseError) {
      console.error(
        "Error al parsear GOOGLE_APPLICATION_CREDENTIALS:",
        parseError
      );
      throw new Error("Error al parsear credenciales de Google");
    }

    // Configurar la autenticación de Google
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const RANGE = "Hoja 1!A:P";

    // Obtener el último ID para generar uno nuevo
    console.log("Obteniendo datos de la hoja para generar ID");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Hoja 1!A:A",
    });

    let nextId = 1;
    if (response.data.values?.length > 1) {
      const lastId = response.data.values[response.data.values.length - 1][0];
      nextId = parseInt(lastId) + 1;
    }

    console.log("Datos del body:", Object.keys(req.body));

    // Preparar los datos para insertar
    const values = [
      [
        nextId,
        new Date().toISOString(),
        req.body.documentType || "",
        req.body.topic || "",
        req.body.citationFormat || "",
        req.body.length || "",
        req.body.course || "",
        req.body.career || "",
        req.body.essayTone || "",
        req.body.additionalInfo || "",
        req.body.index || "",
        req.body.name || "",
        `${req.body.countryCode || ""}${req.body.phoneNumber || ""}`,
        "Pendiente",
        "",
        "",
      ],
    ];

    console.log("Añadiendo datos a la hoja");
    // Añadir los datos a la hoja
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: { values },
    });

    console.log("Datos añadidos correctamente a la hoja");

    // Formatear la fila recién insertada
    try {
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
          ],
        },
      });
      console.log("Formato de celda aplicado correctamente");
    } catch (formatError) {
      console.error("Error al formatear celdas (no crítico):", formatError);
      // No lanzamos error aquí porque esto no es crítico
    }

    return res.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error en append-to-sheet:", error);
    // Proporcionar respuesta de error más detallada
    return res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      details: "Error al intentar guardar datos en Google Sheets",
    });
  }
}
