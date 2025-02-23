import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCheck,
  AlertCircle,
  ChevronLeft,
  List,
  BookOpen,
  FileText,
  ClipboardList,
  Loader,
  GraduationCap,
} from "lucide-react";
import { appendToSheet } from "../services/googleSheets";
import { handleError, handleSuccess } from "../utils/errorHandler";

// Configuración de la API de Claude
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL || "https://academico3.vercel.app/api";

// Definición de las estructuras disponibles
const STRUCTURE_TYPES = {
  estandar: {
    name: "Estructura Estándar",
    icon: FileText,
    description: "Organización tradicional con introducción, desarrollo y conclusiones",
  },
  capitulos: {
    name: "Por Capítulos",
    icon: BookOpen,
    description: "División en capítulos numerados con subsecciones detalladas",
  },
  academica: {
    name: "Estructura Académica",
    icon: GraduationCap,
    description: "Formato académico con objetivos, marco teórico y metodología",
  },
};

function IndexPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {};

  const [isLoading, setIsLoading] = useState(true);
  const [generatedIndex, setGeneratedIndex] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Funciones para obtener información de la estructura
  const getStructureInfo = () => {
    const structureType = formData?.indexStructure || "estandar";
    const structure = STRUCTURE_TYPES[structureType];
    const Icon = structure.icon;

    return {
      name: structure.name,
      icon: <Icon className="w-5 h-5" />,
      description: structure.description,
    };
  };

  // Función para generar el índice usando la API de Claude
  const generateIndexWithClaude = useCallback(async () => {
    if (!formData) return;

    try {
      let structurePrompt = "";
      switch (formData.indexStructure) {
        case "academica":
          structurePrompt =
            "académica formal con introducción, objetivos, marco teórico, metodología, resultados y conclusiones";
          break;
        case "capitulos":
          structurePrompt =
            "por capítulos con numeración romana y subsecciones detalladas";
          break;
        default:
          structurePrompt = "estándar con numeración decimal";
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: `Genera un índice detallado usando estructura ${structurePrompt} para un ${
                formData.documentType
              } sobre "${formData.topic}".
            Especificaciones adicionales:
            - Longitud: ${formData.length}
            - Formato de citación: ${formData.citationFormat}
            - Tono de redacción: ${formData.essayTone}
            - Curso: ${formData.course}
            - Área de estudio: ${formData.career}
            ${
              formData.additionalInfo
                ? `- Instrucciones específicas: ${formData.additionalInfo}`
                : ""
            }`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al conectar con Claude: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("Error al generar índice con Claude:", error);
      throw error;
    }
  }, [formData]);

  // Función para generar índice local como respaldo
  const generateLocalIndex = useCallback(() => {
    if (!formData) return;

    const isLongDocument = formData.length === "largo";
    const title = formData.topic.toUpperCase();

    // Usar un objeto con las estructuras predefinidas
    const structures = {
      estandar: `${title}

1. Introducción
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación

2. Desarrollo
   2.1 Subtema principal
   2.2 Análisis detallado
   ${
     isLongDocument
       ? "2.3 Desarrollo extendido\n   2.4 Análisis complementario"
       : ""
   }

3. Conclusiones
   3.1 Síntesis de hallazgos
   3.2 Consideraciones finales
   ${isLongDocument ? "3.3 Recomendaciones" : ""}

4. Referencias bibliográficas`,

      capitulos: `${title}

CAPITULO I: ASPECTOS INTRODUCTORIOS
1.1 Introducción al tema
1.2 Contexto histórico
${isLongDocument ? "1.3 Antecedentes relevantes" : ""}

CAPITULO II: DESARROLLO CONCEPTUAL
2.1 Desarrollo conceptual
2.2 Análisis detallado
${isLongDocument ? "2.3 Profundización temática" : ""}

CAPITULO III: ANÁLISIS Y DISCUSIÓN
3.1 Análisis de resultados
3.2 Discusión de hallazgos
${isLongDocument ? "3.3 Interpretación extendida" : ""}

CAPITULO IV: CONCLUSIONES
4.1 Conclusiones
4.2 Recomendaciones
${isLongDocument ? "4.3 Perspectivas futuras" : ""}

Referencias bibliográficas`,

      academica: `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación
   ${isLongDocument ? "1.3 Alcance del estudio" : ""}

II. OBJETIVOS
   2.1 Objetivo general
   2.2 Objetivos específicos

III. MARCO TEÓRICO
   3.1 Antecedentes
   3.2 Bases teóricas
   ${isLongDocument ? "3.3 Estado del arte" : ""}

IV. METODOLOGÍA
   4.1 Tipo de investigación
   4.2 Técnicas e instrumentos
   ${isLongDocument ? "4.3 Procedimientos metodológicos" : ""}

V. RESULTADOS Y DISCUSIÓN
   5.1 Presentación de resultados
   5.2 Análisis de hallazgos
   ${isLongDocument ? "5.3 Discusión extendida" : ""}

VI. CONCLUSIONES
   6.1 Conclusiones
   6.2 Recomendaciones
   ${isLongDocument ? "6.3 Líneas futuras de investigación" : ""}

VII. REFERENCIAS BIBLIOGRÁFICAS`,
    };

    // Seleccionar la estructura basada en indexStructure
    const template = structures[formData.indexStructure] || structures.estandar;
    setGeneratedIndex(template);
  }, [formData]);

  useEffect(() => {
    const generateIndex = async () => {
      if (!formData) return;

      try {
        setIsLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || "/api";

        console.log("Enviando datos:", {
          ...formData,
          indexStructure: formData.indexStructure, // Asegurarnos de que se envía
        });

        const response = await fetch(`${apiUrl}/generate-index`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            indexStructure: formData.indexStructure, // Asegurarnos de que se envía
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Error al generar índice: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        setGeneratedIndex(data.index);
        setApiError(
          data.source === "fallback" ? "Se usó un índice predeterminado" : null
        );
      } catch (error) {
        console.error("Error al generar índice:", error);
        generateLocalIndex(); // Fallback a generación local
        setApiError(error.message || "No se pudo generar el índice");
      } finally {
        setIsLoading(false);
      }
    };

    generateIndex();
  }, [formData]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await appendToSheet({
        ...formData,
        index: generatedIndex,
        timestamp: new Date().toISOString(),
      });
      handleSuccess("¡Tu solicitud ha sido guardada correctamente!");
      navigate("/confirmacion", { state: { formData, index: generatedIndex } });
    } catch (error) {
      handleError(error, "Error al procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/configuracion", {
      state: { formData, currentStep: 3 },
    });
  };

  if (!formData) {
    navigate("/configuracion");
    return null;
  }

  const structureInfo = getStructureInfo();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          {/* Contenedor principal que usa space-y-6 para espaciado consistente entre secciones */}
          <div className="space-y-6">
            {/* Encabezado con título y botón de retorno */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <List className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-primary">
                  Índice Propuesto
                </h2>
              </div>
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver al formulario
              </Button>
            </div>

            {/* Resumen del pedido que muestra toda la información recopilada */}
            <div className="bg-muted/20 rounded-lg p-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                Resumen del pedido
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información básica del documento */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">
                      Tipo de Documento:
                    </span>
                    <p className="text-muted-foreground">
                      {formData.documentType}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Tema:</span>
                    <p className="text-muted-foreground">{formData.topic}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Formato:</span>
                    <p className="text-muted-foreground">
                      {formData.citationFormat}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Longitud:</span>
                    <p className="text-muted-foreground">{formData.length}</p>
                  </div>
                </div>

                {/* Información académica y estructura */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Curso:</span>
                    <p className="text-muted-foreground">{formData.course}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Carrera:</span>
                    <p className="text-muted-foreground">{formData.career}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Tono:</span>
                    <p className="text-muted-foreground">
                      {formData.essayTone}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Estructura:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {structureInfo.icon}
                      <div>
                        <p className="text-muted-foreground">
                          {structureInfo.name}
                        </p>
                        <p className="text-xs text-muted-foreground/80">
                          {structureInfo.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de contacto del usuario */}
              <div className="border-t mt-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Nombre:</span>
                    <p className="text-muted-foreground">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">WhatsApp:</span>
                    <p className="text-muted-foreground">
                      {formData.countryCode} {formData.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instrucciones adicionales si existen */}
              {formData.additionalInfo && (
                <div className="border-t mt-4 pt-4">
                  <span className="text-sm font-medium">
                    Instrucciones adicionales:
                  </span>
                  <p className="text-muted-foreground mt-1">
                    {formData.additionalInfo}
                  </p>
                </div>
              )}
            </div>

            {/* Mensaje de error si la API falla */}
            {apiError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <p className="text-yellow-700">{apiError}</p>
                </div>
              </div>
            )}

            {/* Área del índice con editor */}
            <div className="bg-muted/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  Revisa y ajusta el índice según tus necesidades
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                  {structureInfo.icon}
                  <span>{structureInfo.name}</span>
                </div>
              </div>
              <div className="relative">
                <Textarea
                  value={generatedIndex}
                  onChange={(e) => setGeneratedIndex(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  disabled={isLoading}
                  placeholder={isLoading ? "Generando índice..." : ""}
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Generando índice personalizado...</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Puedes editar directamente el índice para ajustarlo a tus
                necesidades específicas. Los cambios que realices aquí se
                guardarán con tu pedido.
              </p>
            </div>

            {/* Sección de acciones finales */}
            <div className="border-t pt-6">
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Importante antes de confirmar
                      </h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>
                          • Revisa que la estructura del índice sea apropiada
                          para tu tema
                        </li>
                        <li>
                          • Verifica que todos los puntos importantes estén
                          incluidos
                        </li>
                        <li>
                          • Asegúrate de que el orden de las secciones sea
                          lógico
                        </li>
                        <li>
                          • Comprueba que las subsecciones estén correctamente
                          numeradas
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                    disabled={isLoading || isSubmitting}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Modificar datos
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={isSubmitting || isLoading}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-4 h-4" />
                        Confirmar y Enviar
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Al confirmar, se guardará tu pedido y te enviaremos los
                  detalles por WhatsApp al {formData.countryCode}{" "}
                  {formData.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IndexPreview;