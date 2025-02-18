// API bridge para redirigir solicitudes a localhost
export default async function handler(req, res) {
  const { path } = req.query;

  // Construir la URL completa para la API de Railway
  const targetUrl = `https://academico3-production.up.railway.app/api/${path.join(
    "/"
  )}`;

  console.log(`🔄 Redirigiendo solicitud a: ${targetUrl}`);

  try {
    // Configurar headers CORS
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

    // Para solicitudes OPTIONS (preflight), devolver 200 OK
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Reenviar la solicitud a la API real
    const apiResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Obtener el cuerpo de la respuesta
    const data = await apiResponse.text();

    // Devolver la respuesta con el mismo código de estado
    return res.status(apiResponse.status).send(data);
  } catch (error) {
    console.error("❌ Error en proxy:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
}
