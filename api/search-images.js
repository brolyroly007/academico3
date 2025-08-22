// api/search-images.js - Función serverless para búsqueda de imágenes
export default async function handler(req, res) {
  console.log('🚀 search-images API called with:', req.method, req.query);
  
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

  try {
    const { query, num = 6 } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Se requiere un término de búsqueda",
      });
    }

    // Configuración de Google Custom Search API desde variables de entorno
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyD1YwYLccJH77CWEUUwZr_Kr_dzANiyWEA";
    const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || "4493382c25c624870";

    // Debug para verificar variables
    console.log('🔑 API Key disponible:', GOOGLE_API_KEY ? 'Sí' : 'No');
    console.log('🔍 Search Engine ID disponible:', GOOGLE_SEARCH_ENGINE_ID ? 'Sí' : 'No');

    // MODO DE PRUEBA - Devolver imágenes de ejemplo si hay problemas con Google API
    if (query.includes('test') || !GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
      console.log('⚠️ Usando modo de prueba - devolviendo imágenes de ejemplo');
      return res.json({
        status: "success",
        images: [
          {
            title: `Logo ${query} 1`,
            link: "https://via.placeholder.com/300x200/0066cc/ffffff?text=Logo+1",
            thumbnail: "https://via.placeholder.com/150x100/0066cc/ffffff?text=Logo+1",
            width: 300,
            height: 200
          },
          {
            title: `Logo ${query} 2`, 
            link: "https://via.placeholder.com/300x200/cc6600/ffffff?text=Logo+2",
            thumbnail: "https://via.placeholder.com/150x100/cc6600/ffffff?text=Logo+2",
            width: 300,
            height: 200
          }
        ],
        totalResults: 2,
        mode: "test"
      });
    }

    // Construir URL de búsqueda de Google Custom Search API
    const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
    searchUrl.searchParams.set("key", GOOGLE_API_KEY);
    searchUrl.searchParams.set("cx", GOOGLE_SEARCH_ENGINE_ID);
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("searchType", "image");
    searchUrl.searchParams.set("num", Math.min(parseInt(num), 10)); // Máximo 10 imágenes
    searchUrl.searchParams.set("safe", "active");
    searchUrl.searchParams.set("imgSize", "medium");
    searchUrl.searchParams.set("imgType", "clipart,face,lineart,news,photo");

    console.log(`🔍 Buscando imágenes para: "${query}"`);

    const response = await fetch(searchUrl.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error Google API (${response.status}):`, errorText);
      throw new Error(`Error en Google API: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Respuesta de Google API:", data);

    if (!data.items || data.items.length === 0) {
      return res.json({
        status: "success",
        images: [],
        message: "No se encontraron imágenes para el término de búsqueda",
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
      images,
      totalResults: data.searchInformation?.totalResults || 0,
    });

  } catch (error) {
    console.error("❌ Error en búsqueda de imágenes:", error);
    
    // En caso de error, devolver imágenes de ejemplo como fallback
    console.log('🔄 Usando fallback con imágenes de ejemplo debido al error');
    return res.json({
      status: "success",
      images: [
        {
          title: `Logo ${query || 'ejemplo'} (fallback)`,
          link: "https://via.placeholder.com/300x200/dc3545/ffffff?text=Logo+Fallback",
          thumbnail: "https://via.placeholder.com/150x100/dc3545/ffffff?text=Logo+Fallback",
          width: 300,
          height: 200
        }
      ],
      totalResults: 1,
      mode: "fallback",
      error: error.message
    });
  }
}