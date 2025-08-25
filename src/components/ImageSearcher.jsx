import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Search, Check, X, ExternalLink } from "lucide-react";

export function ImageSearcher({ onImageSelect, selectedImageUrl = null, customQuery = "", contextualPlaceholder = "" }) {
  const [searchQuery, setSearchQuery] = useState(customQuery);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Actualizar query cuando cambie customQuery
  useEffect(() => {
    if (customQuery && customQuery !== searchQuery) {
      setSearchQuery(customQuery);
    }
  }, [customQuery]);

  // Función para optimizar la query de búsqueda para imágenes
  const optimizeImageQuery = (query) => {
    // Agregar términos que ayuden a encontrar imágenes más relevantes
    let optimizedQuery = query;
    
    // Si no contiene términos específicos de imagen, agregarlos
    if (!query.toLowerCase().includes('foto') && 
        !query.toLowerCase().includes('imagen') && 
        !query.toLowerCase().includes('picture') &&
        !query.toLowerCase().includes('photo')) {
      optimizedQuery = `${query} foto imagen`;
    }
    
    return optimizedQuery;
  };

  const searchImages = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // Usar Google Custom Search API directamente desde el frontend
      const GOOGLE_API_KEY = "AIzaSyD1YwYLccJH77CWEUUwZr_Kr_dzANiyWEA";
      const GOOGLE_SEARCH_ENGINE_ID = "4493382c25c624870";
      
      const searchUrl = new URL("https://www.googleapis.com/customsearch/v1");
      searchUrl.searchParams.set("key", GOOGLE_API_KEY);
      searchUrl.searchParams.set("cx", GOOGLE_SEARCH_ENGINE_ID);
      const optimizedQuery = optimizeImageQuery(searchQuery);
      searchUrl.searchParams.set("q", optimizedQuery);
      searchUrl.searchParams.set("searchType", "image"); // SOLO búsqueda de imágenes
      searchUrl.searchParams.set("num", "9"); // Aumentar a 9 para más opciones
      searchUrl.searchParams.set("safe", "active");
      searchUrl.searchParams.set("imgSize", "medium"); // Tamaño medio para mejor calidad
      searchUrl.searchParams.set("imgType", "photo"); // Solo fotos reales, no clipart
      searchUrl.searchParams.set("imgColorType", "color"); // Priorizar imágenes a color
      searchUrl.searchParams.set("rights", "cc_publicdomain,cc_attribute,cc_sharealike,cc_noncommercial,cc_nonderived"); // Solo imágenes con derechos de uso
      
      const response = await fetch(searchUrl.toString());
      
      if (!response.ok) {
        // Intentar leer el texto de error
        let errorText = `Error ${response.status}`;
        try {
          const errorData = await response.text();
          if (errorData) {
            errorText = errorData;
          }
        } catch (e) {
          // Si no se puede leer el error, usar mensaje genérico
        }
        throw new Error(`Error al buscar imágenes: ${errorText}`);
      }

      // Verificar si la respuesta tiene contenido
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        throw new Error("La respuesta del servidor está vacía");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        console.error("Response text:", responseText);
        throw new Error("La respuesta del servidor no es válida");
      }
      
      if (data.items && data.items.length > 0) {
        // Procesar resultados de Google Custom Search API
        const images = data.items.map((item) => ({
          title: item.title,
          link: item.link,
          thumbnail: item.image?.thumbnailLink,
          width: item.image?.width,
          height: item.image?.height,
          size: item.image?.byteSize,
          contextLink: item.image?.contextLink,
        })).filter(img => img.link && img.thumbnail);
        
        setImages(images);
        if (images.length === 0) {
          setError("No se encontraron imágenes válidas para tu búsqueda. Intenta con otros términos.");
        }
      } else {
        setError("No se encontraron imágenes para tu búsqueda. Intenta con otros términos.");
      }
    } catch (err) {
      const errorMessage = err.message || "Error de conexión. Inténtalo de nuevo.";
      setError(errorMessage);
      console.error("Error buscando imágenes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchImages();
    }
  };

  const selectImage = (imageUrl) => {
    onImageSelect(imageUrl);
  };

  const clearSelection = () => {
    onImageSelect(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>{contextualPlaceholder ? "Buscar imagen relacionada" : "Buscar logo/imagen institucional"}</Label>
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
            📸 Solo imágenes
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={contextualPlaceholder || "Buscar imágenes relacionadas"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={searchImages}
            disabled={loading || !searchQuery.trim()}
            className="px-6"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </div>

      {selectedImageUrl && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-green-700 dark:text-green-300 font-medium">
                Imagen seleccionada:
              </Label>
              <Button
                size="sm"
                variant="outline"
                onClick={clearSelection}
                className="h-6 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={selectedImageUrl}
                alt="Logo seleccionado"
                className="w-16 h-16 object-contain rounded border"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-green-600 dark:text-green-400 break-all">
                  {selectedImageUrl}
                </p>
                <a
                  href={selectedImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                  Ver imagen completa <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {hasSearched && !loading && !error && images.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Resultados de búsqueda (haz clic para seleccionar):
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
            {images.map((image, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  selectedImageUrl === image.link
                    ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => selectImage(image.link)}
              >
                <CardContent className="p-2">
                  <div className="relative">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-20 object-contain rounded"
                      onError={(e) => {
                        e.target.parentElement.style.display = "none";
                      }}
                    />
                    {selectedImageUrl === image.link && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {image.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {hasSearched && !loading && images.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No se encontraron imágenes</p>
          <p className="text-sm">Intenta con términos más específicos o diferentes palabras clave</p>
          <p className="text-xs mt-2 text-gray-400">💡 Tip: Usa nombres propios, lugares específicos o términos descriptivos</p>
        </div>
      )}
    </div>
  );
}

export default ImageSearcher;