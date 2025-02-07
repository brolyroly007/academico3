/* eslint-disable no-undef */
import express from "express";
import { google } from "googleapis";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["https://academico3.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

async function setupSheet(sheets, spreadsheetId) {
  try {
    const headers = [
      "ID",
      "Fecha",
      "Tipo",
      "Tema",
      "Formato",
      "Longitud",
      "Curso",
      "Carrera",
      "Tono",
      "Estructura",
      "Índice",
      "Contacto",
      "WhatsApp",
      "Status",
      "Asignado a",
      "Fecha entrega",
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Hoja 1!A1:P1",
      valueInputOption: "RAW",
      resource: { values: [headers] },
    });

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.8, green: 0.8, blue: 0.8 },
                  textFormat: { bold: true },
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat)",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "COLUMNS",
                startIndex: 10,
                endIndex: 11,
              },
              properties: { pixelSize: 400 },
              fields: "pixelSize",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error configurando la hoja:", error);
  }
}

app.post("/api/generate-index", async (req, res) => {
  try {
    console.log("Recibido en servidor:", req.body);
    const { documentType, topic, length, additionalInfo } = req.body;

    if (!documentType || !topic || !length) {
      return res.status(400).json({ error: "Campos requeridos faltantes" });
    }

    const prompt =
      documentType.toLowerCase() === "ensayo"
        ? `[Título principal]
         1. Introducción
         2. Desarrollo
             [3-4 Subtemas específicos]
         3. Conclusiones
         4. Bibliografía`
        : `I. Sección principal
         1.1 Subsección
         1.2 Subsección`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Genera un índice para un ${documentType} sobre "${topic}". 
         Longitud: ${length}.
         Estructura sugerida: ${prompt}
         Información adicional: ${additionalInfo || "No hay"}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    res.json({ index: data.content[0].text });
  } catch (error) {
    console.error("Error completo:", error);
    res
      .status(500)
      .json({ error: "Error al generar índice", details: error.message });
  }
});

app.post("/api/append-to-sheet", async (req, res) => {
  try {
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
    const RANGE = "Hoja 1!A:P";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Hoja 1!A:A",
    });

    let nextId = 1;
    if (response.data.values?.length > 1) {
      const lastId = response.data.values[response.data.values.length - 1][0];
      nextId = parseInt(lastId) + 1;
    }

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
      ],
    ];

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: { values },
    });

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

    res.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/setup-sheet", async (req, res) => {
  try {
    await setupSheet(sheets, process.env.GOOGLE_SHEETS_ID);
    res.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  setupSheet(sheets, process.env.GOOGLE_SHEETS_ID);
});
