import express from "express";
import { google } from "googleapis";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware de logging
app.use(morgan("dev"));

// Middleware de depuración de solicitudes
app.use((req, res, next) => {
  console.log(`🔍 Solicitud recibida: ${req.method} ${req.path}`);
  console.log("📦 Headers:", req.headers);
  console.log("🌐 Origin:", req.get("origin"));
  next();
});

// Configuración CORS mejorada
const allowedOrigins = [
  "https://academico3.vercel.app",
  "https://academico3-production.up.railway.app",
  "https://academico3-frontend.onrender.com", // Añade tu frontend de Render
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir solicitudes sin origen (ej. herramientas de desarrollo)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`Origen bloqueado por CORS: ${origin}`);
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Habilitar CORS para todas las rutas
app.options("*", cors());

app.use(express.json());

// Añade este nuevo endpoint de health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend está funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

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

// Endpoint para generar índice
app.post("/api/generate-index", async (req, res) => {
  try {
    console.log("🚀 Solicitud de generación de índice recibida");
    console.log("📦 Datos recibidos:", JSON.stringify(req.body, null, 2));
    console.log("🔍 Origen:", req.get("origin"));

    // Establecer cabeceras CORS explícitamente
    res.header("Access-Control-Allow-Origin", req.get("origin") || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    const { documentType, topic, length, additionalInfo } = req.body;

    if (!documentType || !topic || !length) {
      console.error("❌ Campos requeridos faltantes");
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        received: req.body,
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Genera un índice para un ${documentType} sobre "${topic}". 
          El documento será de ${length}. 
          
          ${
            documentType.toLowerCase() === "ensayo"
              ? `
          Usa esta estructura:
          [Título principal]
              1. Introducción
              2. Desarrollo
                  [3-4 Subtemas específicos]
              3. Conclusiones
              4. Bibliografía
          `
              : `
          Usa una estructura más detallada con:
          - 4-6 secciones principales en numeración romana
          - 2-3 subsecciones por sección en numeración arábiga
          - Formato: 
            I. Sección principal
                1.1 Subsección
                1.2 Subsección
          `
          }
          
          Información adicional a considerar: ${
            additionalInfo || "No hay información adicional"
          }
          
          Genera un índice específico al tema y mantén coherencia.
          Solo entrega el índice, sin explicaciones adicionales.`,
          },
        ],
      }),
    });

    console.log("Respuesta de Claude status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error de Claude:", errorText);
      throw new Error("Error en la API de Claude: " + errorText);
    }

    const data = await response.json();
    console.log("Respuesta de Claude recibida correctamente");

    res.json({ index: data.content[0].text });
  } catch (error) {
    console.error("🚨 Error completo en generación de índice:", error);
    res.status(500).json({
      error: "Error al generar índice",
      details: error.message,
      fullError: error.toString(),
    });
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  setupSheet(sheets, process.env.GOOGLE_SHEETS_ID);
});
