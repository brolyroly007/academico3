// api/search-images.js - Función serverless para búsqueda de imágenes

function generateFallbackImages(query) {
  return [
    {
      title: `${query} - Logo genérico 1`,
      link: "https://via.placeholder.com/300x200/1e40af/ffffff?text=LOGO",
      thumbnail: "https://via.placeholder.com/150x100/1e40af/ffffff?text=LOGO",
      width: 300,
      height: 200
    },
    {
      title: `${query} - Logo genérico 2`, 
      link: "https://via.placeholder.com/300x200/dc2626/ffffff?text=LOGO",
      thumbnail: "https://via.placeholder.com/150x100/dc2626/ffffff?text=LOGO",
      width: 300,
      height: 200
    },
    {
      title: `${query} - Logo genérico 3`,
      link: "https://via.placeholder.com/300x200/059669/ffffff?text=LOGO",
      thumbnail: "https://via.placeholder.com/150x100/059669/ffffff?text=LOGO",
      width: 300,
      height: 200
    },
    {
      title: `${query} - Logo genérico 4`,
      link: "https://via.placeholder.com/300x200/7c3aed/ffffff?text=LOGO",
      thumbnail: "https://via.placeholder.com/150x100/7c3aed/ffffff?text=LOGO",
      width: 300,
      height: 200
    },
    {
      title: `${query} - Logo genérico 5`,
      link: "https://via.placeholder.com/300x200/ea580c/ffffff?text=LOGO",
      thumbnail: "https://via.placeholder.com/150x100/ea580c/ffffff?text=LOGO",
      width: 300,
      height: 200
    },
    {
      title: `${query} - Logo genérico 6`,
      link: "https://via.placeholder.com/300x200/0891b2/ffffff?text=LOGO",
      thumbnail: "https://via.placeholder.com/150x100/0891b2/ffffff?text=LOGO",
      width: 300,
      height: 200
    }
  ];
}

export default async function handler(req, res) {
  try {
    console.log('🚀 search-images API called with:', req.method, req.query);
    
    // Configurar CORS
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    if (req.method !== "GET") {
      return res.status(405).json({ 
        status: 'error', 
        message: 'Método no permitido' 
      });
    }

    const { query, num = 6 } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Se requiere un término de búsqueda",
      });
    }

    // Configuración de Google Custom Search API 
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
      console.log('🔄 API credentials not configured, using fallback images');
      return res.json({
        status: "success",
        images: generateFallbackImages(query),
        mode: "fallback_no_credentials"
      });
    }

    // Debug para verificar variables
    console.log('🔑 API Key disponible:', GOOGLE_API_KEY ? 'Sí' : 'No');
    console.log('🔍 Search Engine ID disponible:', GOOGLE_SEARCH_ENGINE_ID ? 'Sí' : 'No');

    // Construir URL de búsqueda de Google Custom Search API
    const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
    searchUrl.searchParams.set("key", GOOGLE_API_KEY);
    searchUrl.searchParams.set("cx", GOOGLE_SEARCH_ENGINE_ID);
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("searchType", "image");
    searchUrl.searchParams.set("num", Math.min(parseInt(num), 6)); // Exactamente 6 imágenes
    searchUrl.searchParams.set("safe", "active");
    searchUrl.searchParams.set("imgSize", "medium");
    searchUrl.searchParams.set("imgType", "clipart,lineart,photo");
    searchUrl.searchParams.set("fileType", "jpg,png");
    searchUrl.searchParams.set("rights", "cc_publicdomain,cc_attribute,cc_sharealike,cc_noncommercial");

    console.log(`🔍 Buscando imágenes para: "${query}"`);

    const response = await fetch(searchUrl.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error Google API (${response.status}):`, errorText);
      
      // En caso de error de Google API, devolver imágenes de fallback
      console.log('🔄 Error en Google API, usando fallback con imágenes genéricas');
      return res.json({
        status: "success",
        images: generateFallbackImages(query),
        mode: "fallback_api_error",
        error: `Google API Error: ${response.status}`
      });
    }

    const data = await response.json();
    console.log("Respuesta de Google API:", data);

    if (!data.items || data.items.length === 0) {
      return res.json({
        status: "success",
        images: generateFallbackImages(query),
        message: "No se encontraron imágenes para el término de búsqueda",
        mode: "fallback_no_results"
      });
    }

    // Procesar y filtrar los resultados
    const images = data.items.map((item) => ({
      title: item.title,
      link: item.link,
      thumbnail: item.image?.thumbnailLink,
      width: item.image?.width,
      height: item.image?.height,
      size: item.image?.byteSize,
      contextLink: item.image?.contextLink,
    })).filter(img => img.link && img.thumbnail);

    console.log(`✅ Encontradas ${images.length} imágenes para "${query}"`);

    res.json({
      status: "success",
      images: images.length > 0 ? images : generateFallbackImages(query),
      totalResults: data.searchInformation?.totalResults || 0,
      mode: images.length > 0 ? "google_api" : "fallback_filtered"
    });

  } catch (error) {
    console.error("❌ Error en búsqueda de imágenes:", error);
    
    // En caso de error, devolver imágenes de ejemplo como fallback
    console.log('🔄 Usando fallback con imágenes de ejemplo debido al error');
    return res.json({
      status: "success",
      images: generateFallbackImages(req.query?.query || 'ejemplo'),
      mode: "fallback",
      error: error.message
    });
  }
}