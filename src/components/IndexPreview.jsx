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
  FileText,
  BookOpen,
  GraduationCap,
  Loader,
} from "lucide-react";
import { appendToSheet } from "../services/googleSheets";
import { handleError, handleSuccess } from "../utils/errorHandler";

// Definición de las estructuras disponibles
const STRUCTURE_TYPES = {
  estandar: {
    name: "Estructura Estándar",
    icon: FileText,
    description:
      "Organización tradicional con introducción, desarrollo y conclusiones",
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

  // Función para obtener información de la estructura
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

  // Función para generar índice local como respaldo
  const generateLocalIndex = useCallback(() => {
    if (!formData) return "";

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

    return structures[formData.indexStructure] || structures.estandar;
  }, [formData]);

  useEffect(() => {
    const generateIndex = async () => {
      if (!formData) return;

      try {
        setIsLoading(true);
        const apiUrl = "/api";

        console.log("Enviando estructura:", formData.indexStructure);

        const requestData = {
          documentType: formData.documentType,
          topic: formData.topic,
          length: formData.length,
          indexStructure: formData.indexStructure,
          course: formData.course,
          career: formData.career,
          essayTone: formData.essayTone,
          additionalInfo: formData.additionalInfo,
        };

        const response = await fetch(`${apiUrl}/generate-index`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error(`Error al generar índice: ${response.status}`);
        }

        const data = await response.json();

        if (data.source === "fallback") {
          const localIndex = generateLocalIndex();
          setGeneratedIndex(localIndex);
          setApiError("Se está usando un índice predeterminado");
        } else {
          setGeneratedIndex(data.index);
        }
      } catch (error) {
        console.error("Error generando índice:", error);
        const localIndex = generateLocalIndex();
        setGeneratedIndex(localIndex);
        setApiError("Error en la generación del índice");
      } finally {
        setIsLoading(false);
      }
    };

    generateIndex();
  }, [formData, generateLocalIndex]);

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
      state: {
        formData,
        currentStep: 4, // Cambiamos a paso 4 (detalles finales)
        maxVisitedStep: 4, // Importante para permitir la navegación
      },
    });
  };

  if (!formData) {
    navigate("/configuracion");
    return null;
  }

  const structureInfo = getStructureInfo();

  return (
    <div className="min-h-[100dvh] w-full px-2 sm:px-4 py-2 sm:py-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <Card className="border-0 shadow-xl flex-1 flex flex-col">
          <CardContent className="p-3 sm:p-8 flex flex-col flex-1">
            {/* Contenedor principal que usa space-y-6 para espaciado consistente entre secciones */}
            <div className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
              {/* Encabezado con título y botón de retorno */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <List className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h2 className="text-xl sm:text-2xl font-bold text-primary">
                    Índice Propuesto
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-sm sm:text-base"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Volver al formulario</span>
                  <span className="inline sm:hidden">Volver</span>
                </Button>
              </div>

              {/* Resumen del pedido que muestra toda la información recopilada */}
              <div className="bg-muted/20 rounded-lg p-3 sm:p-6">
                <h3 className="font-medium mb-2 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <List className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Resumen del pedido
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                  {/* Información básica del documento */}
                  <div className="space-y-2 sm:space-y-4">
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Tipo de Documento:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.documentType}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Tema:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.topic}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Formato de Citas:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.citationFormat}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Longitud:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.length}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Tono de Redacción:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.essayTone}
                      </p>
                    </div>
                  </div>
                  {/* Información académica y estructura */}
                  <div className="space-y-2 sm:space-y-4">
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Curso:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.course}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Área de Estudio:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.career}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Estructura:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {structureInfo.icon}
                        <div>
                          <p className="text-muted-foreground text-sm">
                            {structureInfo.name}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground/80">
                            {structureInfo.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Información de contacto */}
                <div className="border-t mt-3 pt-3 sm:mt-4 sm:pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Nombre:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.name}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        WhatsApp:
                      </span>
                      <p className="text-muted-foreground text-sm">
                        {formData.countryCode} {formData.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Área del índice - ocupa el espacio restante */}
              <div className="bg-muted/20 rounded-lg p-3 sm:p-6 flex-1 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-lg font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    <span className="hidden sm:inline">
                      Revisa y ajusta el índice según tus necesidades
                    </span>
                    <span className="inline sm:hidden">Revisa el índice</span>
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-muted rounded-full text-xs sm:text-sm">
                    {structureInfo.icon}
                    <span>{structureInfo.name}</span>
                  </div>
                </div>
                <div className="relative flex-1 flex flex-col">
                  <Textarea
                    value={generatedIndex}
                    onChange={(e) => setGeneratedIndex(e.target.value)}
                    className="flex-1 min-h-0 font-mono text-xs sm:text-sm resize-none"
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
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                  Puedes editar directamente el índice para ajustarlo a tus
                  necesidades específicas. Los cambios que realices aquí se
                  guardarán con tu pedido.
                </p>
              </div>

              {/* Sección de acciones finales */}
              <div className="border-t pt-3 sm:pt-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 text-xs sm:text-sm">
                          Importante antes de confirmar
                        </h4>
                        <ul className="text-xs sm:text-sm text-blue-700 mt-1 space-y-0.5 sm:space-y-1">
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

                  <div className="flex justify-end gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="gap-1 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10"
                      disabled={isLoading || isSubmitting}
                    >
                      <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Modificar datos</span>
                      <span className="inline sm:hidden">Volver</span>
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      disabled={isSubmitting || isLoading}
                      className="gap-1 sm:gap-2 bg-primary hover:bg-primary/90 text-xs sm:text-sm h-9 sm:h-10"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                          <span className="hidden sm:inline">
                            Procesando...
                          </span>
                          <span className="inline sm:hidden">Enviando...</span>
                        </>
                      ) : (
                        <>
                          <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">
                            Confirmar y Enviar
                          </span>
                          <span className="inline sm:hidden">Confirmar</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
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
    </div>
  );
}

export default IndexPreview;
