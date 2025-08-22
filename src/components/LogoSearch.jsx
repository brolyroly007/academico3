// src/components/LogoSearch.jsx - Componente para búsqueda de logos
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Search, Check, Image } from "lucide-react";

export function LogoSearch({ institutionName, onLogoSelect, selectedLogoUrl }) {
  const [isSearching, setIsSearching] = useState(false);
  const [images, setImages] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchLogos = async () => {
    if (!institutionName.trim()) return;

    setIsSearching(true);
    try {
      const searchQuery = `${institutionName} logo`;
      const response = await fetch(
        `/api/search-images?query=${encodeURIComponent(searchQuery)}&num=6`
      );

      if (!response.ok) {
        throw new Error("Error en la búsqueda de imágenes");
      }

      const data = await response.json();
      setImages(data.images || []);
      setHasSearched(true);
    } catch (error) {
      console.error("Error buscando logos:", error);
      setImages([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogoSelect = (imageUrl) => {
    onLogoSelect(imageUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={searchLogos}
          disabled={!institutionName.trim() || isSearching}
          className="flex items-center gap-2"
        >
          {isSearching ? (
            <>
              <LoadingSpinner size="sm" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Buscar logo
            </>
          )}
        </Button>
      </div>

      {hasSearched && (
        <div className="space-y-3">
          {images.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                Selecciona el logo de tu institución:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedLogoUrl === image.link
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:ring-1 hover:ring-primary/50"
                    }`}
                    onClick={() => handleLogoSelect(image.link)}
                  >
                    <CardContent className="p-3">
                      <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={image.thumbnail || image.link}
                          alt={image.title || "Logo"}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="hidden w-full h-full items-center justify-center bg-gray-200"
                          style={{ display: "none" }}
                        >
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                        {selectedLogoUrl === image.link && (
                          <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 truncate">
                        {image.title || "Logo"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {selectedLogoUrl && (
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Logo seleccionado correctamente
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No se encontraron logos para "{institutionName}"</p>
              <p className="text-xs mt-1">
                Intenta con un nombre más específico
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LogoSearch;