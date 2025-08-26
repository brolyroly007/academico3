// api/search-images.js - Simple test version

export default async function handler(req, res) {
  console.log('🚀 search-images API called');
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    status: "success",
    message: "API is working",
    method: req.method,
    query: req.query,
    timestamp: new Date().toISOString()
  });
}