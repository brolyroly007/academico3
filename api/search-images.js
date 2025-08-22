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

    // Configuración de Google Custom Search API 
    const GOOGLE_API_KEY = "AIzaSyD1YwYLccJH77CWEUUwZr_Kr_dzANiyWEA";
    const GOOGLE_SEARCH_ENGINE_ID = "4493382c25c624870";

    // Debug para verificar variables
    console.log('🔑 API Key disponible:', GOOGLE_API_KEY ? 'Sí' : 'No');
    console.log('🔍 Search Engine ID disponible:', GOOGLE_SEARCH_ENGINE_ID ? 'Sí' : 'No');

    // Intentar siempre con Google API real

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
        images: [
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
        ],
        totalResults: 6,
        mode: "fallback_api_error",
        error: `Google API Error: ${response.status}`
      });
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