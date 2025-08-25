import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageSearcher } from "@/components/ImageSearcher";
import { Plus, Minus, FileImage, Info } from "lucide-react";

export function AnnexManager({ setAnnexData, annexData = {}, generatedIndex = "", documentTopic = "", documentType = "" }) {
  const [includeAnnex, setIncludeAnnex] = useState(
    annexData.incluirAnexos || false
  );
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  
  // Función para generar sugerencias de anexos con IA
  const generateAISuggestions = async () => {
    if (!generatedIndex || !documentTopic) return;
    
    setIsGeneratingSuggestions(true);
    
    try {
      const prompt = `Basándote en el siguiente índice de un ${documentType} sobre "${documentTopic}", genera exactamente 10 títulos específicos y relevantes para anexos que complementen el documento.

ÍNDICE:
${generatedIndex}

Los anexos deben ser específicos, útiles y relacionados directamente con el contenido. Ejemplos de tipos de anexos: 
- Tablas de datos estadísticos
- Instrumentos de recolección (encuestas, cuestionarios)
- Fotografías o evidencias visuales
- Esquemas, mapas conceptuales o diagramas
- Entrevistas o testimonios
- Documentos legales o normativas
- Cronogramas o planificaciones
- Glosarios especializados
- Análisis complementarios
- Casos de estudio específicos

Responde ÚNICAMENTE con una lista numerada de 10 títulos, sin explicaciones adicionales:

1.
2.
3.
...`;

      const response = await fetch('/api/generate-annexes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          topic: documentTopic,
          documentType: documentType,
          index: generatedIndex
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.suggestions) {
        // Extraer los títulos de la respuesta de IA
        const suggestions = data.suggestions
          .split('\n')
          .filter(line => line.match(/^\d+\./))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(title => title.length > 0)
          .slice(0, 10); // Asegurar máximo 10 sugerencias

        setAiSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error generando sugerencias de anexos:', error);
      // Fallback a sugerencias básicas contextuales
      setAiSuggestions(generateContextualSuggestions());
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Función de fallback para generar sugerencias contextuales básicas
  const generateContextualSuggestions = () => {
    const baseSuggestions = [
      "Encuesta aplicada a estudiantes",
      "Tabla de datos estadísticos",
      "Fotografías del proceso de investigación",
      "Instrumentos de recolección de datos",
      "Esquemas y mapas conceptuales",
      "Cronograma de actividades realizadas",
      "Entrevistas con expertos del tema",
      "Documentos normativos relacionados",
      "Glosario de términos técnicos",
      "Casos de estudio complementarios"
    ];

    // Personalizar según el tema y tipo de documento
    if (documentTopic.toLowerCase().includes('educación') || documentTopic.toLowerCase().includes('enseñanza')) {
      return [
        "Planes de clase o sesiones educativas",
        "Evaluaciones y rúbricas aplicadas",
        "Fotografías de actividades educativas",
        ...baseSuggestions.slice(3, 10)
      ];
    } else if (documentTopic.toLowerCase().includes('empresa') || documentTopic.toLowerCase().includes('negocio')) {
      return [
        "Estados financieros y reportes económicos",
        "Organigramas y estructuras organizacionales",
        "Análisis FODA de la empresa",
        ...baseSuggestions.slice(3, 10)
      ];
    } else if (documentTopic.toLowerCase().includes('salud') || documentTopic.toLowerCase().includes('médico')) {
      return [
        "Historiales clínicos (anonimizados)",
        "Protocolos médicos utilizados",
        "Datos epidemiológicos relevantes",
        ...baseSuggestions.slice(3, 10)
      ];
    }
    
    return baseSuggestions;
  };
  
  // Función para extraer títulos del índice generado
  const extractTitlesFromIndex = (indexText) => {
    if (!indexText) return getDefaultTitles();
    
    const lines = indexText.split('\n');
    const extractedTitles = [];
    
    // Buscar líneas que contengan títulos principales (numeración 1., 2., 3., I., II., etc.)
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Patrones para detectar títulos principales
      const patterns = [
        /^(\d+\.)\s+(.+)$/,           // 1. TITULO, 2. TITULO, etc.
        /^([IVXLC]+\.)\s+(.+)$/,     // I. TITULO, II. TITULO, etc.
        /^(CAPITULO\s+[IVXLC]+):\s*(.+)$/i, // CAPITULO I: TITULO
      ];
      
      for (let pattern of patterns) {
        const match = trimmedLine.match(pattern);
        if (match && match[2]) {
          let title = match[2].trim();
          // Limpiar el título y generar sugerencia de anexo
          title = title.replace(/:/g, '').trim();
          
          // Generar títulos de anexos basados en el contenido
          if (title.toLowerCase().includes('introducción') || title.toLowerCase().includes('aspectos introductorios')) {
            extractedTitles.push(`Antecedentes históricos de ${title.toLowerCase()}`);
          } else if (title.toLowerCase().includes('metodología') || title.toLowerCase().includes('método')) {
            extractedTitles.push(`Instrumentos de recolección de datos`);
          } else if (title.toLowerCase().includes('resultado') || title.toLowerCase().includes('análisis')) {
            extractedTitles.push(`Tablas de datos estadísticos`);
          } else if (title.toLowerCase().includes('marco teórico') || title.toLowerCase().includes('fundamento')) {
            extractedTitles.push(`Esquemas conceptuales relacionados`);
          } else if (title.toLowerCase().includes('desarrollo') || title.toLowerCase().includes('discusión')) {
            extractedTitles.push(`Evidencias fotográficas del proceso`);
          } else {
            // Generar título genérico basado en el contenido
            extractedTitles.push(`Documentación complementaria de ${title.toLowerCase()}`);
          }
          
          if (extractedTitles.length >= 3) break;
        }
      }
      
      if (extractedTitles.length >= 3) return;
    });
    
    // Si no se encontraron suficientes títulos, completar con títulos por defecto
    while (extractedTitles.length < 3) {
      const defaultTitles = getDefaultTitles();
      const missingTitle = defaultTitles[extractedTitles.length];
      if (missingTitle && !extractedTitles.find(t => t === missingTitle.titulo)) {
        extractedTitles.push(missingTitle.titulo);
      }
    }
    
    return extractedTitles.slice(0, 3).map(titulo => ({ titulo, imagenUrl: "" }));
  };
  
  // Títulos por defecto como fallback
  const getDefaultTitles = () => [
    { titulo: "Encuesta aplicada", imagenUrl: "" },
    { titulo: "Tabla de datos estadísticos", imagenUrl: "" },
    { titulo: "Fotografías del proceso", imagenUrl: "" }
  ];
  
  // Inicializar anexos basados en el índice o usar valores existentes
  const [annexes, setAnnexes] = useState(() => {
    if (annexData.anexos?.length) {
      return annexData.anexos;
    }
    return extractTitlesFromIndex(generatedIndex);
  });
  
  // Actualizar anexos cuando cambie el índice generado
  useEffect(() => {
    if (generatedIndex && !annexData.anexos?.length) {
      const suggestedTitles = extractTitlesFromIndex(generatedIndex);
      setAnnexes(suggestedTitles);
    }
  }, [generatedIndex, annexData.anexos]);

  // Generar sugerencias automáticamente cuando se tenga el índice y el tema
  useEffect(() => {
    if (generatedIndex && documentTopic && aiSuggestions.length === 0 && !isGeneratingSuggestions) {
      // Generar sugerencias automáticamente con un pequeño delay
      const timer = setTimeout(() => {
        generateAISuggestions();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [generatedIndex, documentTopic, aiSuggestions.length, isGeneratingSuggestions]);

  // Efecto para actualizar los datos del componente padre
  useEffect(() => {
    if (!includeAnnex) {
      setAnnexData({ incluirAnexos: false });
      return;
    }

    setAnnexData({
      incluirAnexos: includeAnnex,
      anexos: annexes,
    });
  }, [includeAnnex, annexes, setAnnexData]);

  // Función para agregar un nuevo anexo (límite de 7)
  const addAnnex = () => {
    if (annexes.length >= 7) return; // Límite de 7 anexos
    
    const newAnnex = { 
      titulo: "Nuevo anexo", 
      imagenUrl: "" 
    };
    setAnnexes([...annexes, newAnnex]);
  };

  // Función para eliminar un anexo
  const removeAnnex = (index) => {
    if (annexes.length <= 1) return; // Mantener al menos un anexo
    setAnnexes(annexes.filter((_, i) => i !== index));
  };

  // Función para actualizar el título de un anexo
  const updateAnnexTitle = (index, titulo) => {
    const newAnnexes = [...annexes];
    newAnnexes[index] = { ...newAnnexes[index], titulo };
    setAnnexes(newAnnexes);
  };

  // Función para manejar la selección de imagen para un anexo específico
  const handleImageSelect = (index, imageUrl) => {
    const newAnnexes = [...annexes];
    newAnnexes[index] = { ...newAnnexes[index], imagenUrl: imageUrl };
    setAnnexes(newAnnexes);
  };

  // Función para aplicar una sugerencia de IA como título
  const applySuggestion = (suggestionTitle) => {
    if (annexes.length >= 7) return; // Respetear límite
    
    const newAnnex = { 
      titulo: suggestionTitle, 
      imagenUrl: "" 
    };
    setAnnexes([...annexes, newAnnex]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="incluirAnexos"
          checked={includeAnnex}
          onCheckedChange={setIncludeAnnex}
        />
        <Label
          htmlFor="incluirAnexos"
          className="text-base font-medium cursor-pointer flex items-center gap-2"
        >
          <FileImage className="w-4 h-4" />
          ¿Añadir anexos?
        </Label>
      </div>

      {includeAnnex && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-900 rounded-lg p-4">
            <div className="flex gap-2">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Los anexos aparecerán al final del documento. Los títulos se han sugerido automáticamente basándose en el contenido del índice generado. Puedes modificarlos y buscar imágenes relacionadas para cada uno.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Anexos del documento</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={generateAISuggestions}
                  disabled={isGeneratingSuggestions || !generatedIndex || !documentTopic}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {isGeneratingSuggestions ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Generando...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Sugerencias IA
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addAnnex}
                  disabled={annexes.length >= 7}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar anexo ({annexes.length}/7)
                </Button>
              </div>
            </div>

            {/* Sugerencias de IA */}
            {aiSuggestions.length > 0 && (
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800/50">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        🤖 Sugerencias de anexos generadas por IA - Haz clic para agregar:
                      </Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => applySuggestion(suggestion)}
                          disabled={annexes.length >= 7}
                          className="justify-start text-left h-auto py-2 px-3 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                          <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="text-xs">{suggestion}</span>
                        </Button>
                      ))}
                    </div>
                    {annexes.length >= 7 && (
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                        Has alcanzado el límite máximo de 7 anexos.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {annexes.map((annex, index) => (
                <Card key={index} className="border-primary/20">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2 justify-between">
                      <Label className="text-base font-medium">
                        Anexo {index + 1}
                      </Label>
                      {annexes.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => removeAnnex(index)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Título del anexo *</Label>
                      <Input
                        placeholder="Ej: Encuesta aplicada a estudiantes"
                        value={annex.titulo}
                        onChange={(e) => updateAnnexTitle(index, e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Búsqueda de imagen para el anexo */}
                    <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-900/10 dark:border-orange-800/50">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <Label className="text-sm font-medium text-orange-700 dark:text-orange-300">
                              🖼️ Buscar imagen para este anexo (opcional)
                            </Label>
                          </div>
                          <ImageSearcher
                            onImageSelect={(imageUrl) => handleImageSelect(index, imageUrl)}
                            selectedImageUrl={annex.imagenUrl}
                            customQuery={annex.titulo}
                            contextualPlaceholder={`Buscar imágenes para: "${annex.titulo}"`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {annexes.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-900 rounded-lg p-4 mt-4">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Se han configurado <strong>{annexes.length}</strong> anexo(s) que se incluirán al final del documento.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnnexManager;