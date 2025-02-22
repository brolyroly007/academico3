export default function handler(req, res) {
  res.status(200).json({
    status: "OK",
    message: "API está funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
}
