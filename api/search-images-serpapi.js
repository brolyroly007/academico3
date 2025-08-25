// api/search-images-serpapi.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Configurar SerpApi - necesitarás obtener una API key de https://serpapi.com
    const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY || "demo"; // Usar "demo" para pruebas

    const searchParams = new URLSearchParams({
      engine: "google_images",
      q: query,
      api_key: SERPAPI_API_KEY,
      hl: "es", // Español
      gl: "pe", // Perú para resultados más relevantes localmente
      safe: "active", // Búsqueda segura
      num: "9", // 9 imágenes
      device: "desktop"
    });

    const response = await fetch(`https://serpapi.com/search.json?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`SerpApi error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extraer solo las imágenes relevantes
    const images = [];
    
    if (data.images_results && data.images_results.length > 0) {
      data.images_results.forEach((item, index) => {
        if (index < 9) { // Máximo 9 imágenes
          images.push({
            title: item.title || `Imagen ${index + 1}`,
            thumbnail: item.thumbnail,
            original: item.original,
            link: item.link,
            source: item.source || '',
            width: item.original_width,
            height: item.original_height
          });
        }
      });
    }

    // Si no hay resultados en images_results, buscar en shopping_results como fallback
    if (images.length === 0 && data.shopping_results && data.shopping_results.length > 0) {
      data.shopping_results.forEach((item, index) => {
        if (index < 9 && item.thumbnail) {
          images.push({
            title: item.title || `Producto ${index + 1}`,
            thumbnail: item.thumbnail,
            original: item.thumbnail,
            link: item.link,
            source: item.source || '',
            width: 300,
            height: 300
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      images: images,
      total_results: images.length,
      api_used: "serpapi"
    });

  } catch (error) {
    console.error('SerpApi error:', error);
    
    // Fallback a respuesta vacía en caso de error
    return res.status(200).json({
      success: false,
      images: [],
      error: error.message,
      api_used: "serpapi_fallback"
    });
  }
}