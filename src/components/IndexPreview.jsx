// src/components/IndexPreview.jsx
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
  ListTree,
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
    description: "División en capítulos numerados con subsecciones detalladas",
    icon: ListTree,
  },
  academica: {
    name: "Estructura Académica",
    description: "Formato académico con objetivos, marco teórico y metodología",
    icon: GraduationCap,
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

    // Para ensayos, mostrar información especial
    if (formData?.documentType === "ensayo") {
      return {
        name: "Estructura de Ensayo",
        icon: <FileText className="w-5 h-5" />,
        description: "Formato específico para ensayos académicos",
      };
    }

    const structure = STRUCTURE_TYPES[structureType];
    const Icon = structure?.icon || FileText;

    return {
      name: structure?.name || "Estructura Estándar",
      icon: <Icon className="w-5 h-5" />,
      description: structure?.description || "Estructura por defecto",
    };
  };

  // Función para generar índice local como respaldo
  const generateLocalIndex = useCallback(() => {
    if (!formData) return "";

    // Extraer el número máximo de páginas del rango seleccionado
    const paginas = formData.length;
    let maxPages = 15; // Valor por defecto

    if (paginas && paginas.includes("-")) {
      const [_, maxPagesStr] = paginas.split("-");
      maxPages = parseInt(maxPagesStr);
    } else if (paginas) {
      maxPages = parseInt(paginas);
    }

    // Para ensayos, usar una estructura específica
    if (formData.documentType === "ensayo") {
      return generateEssayIndex(formData.topic, maxPages);
    }

    // Calcular el número de secciones y subsecciones basado en la cantidad de páginas
    // Esto emula la lógica de content_generator.py
    const numMainSections = Math.max(3, Math.min(15, Math.floor(maxPages / 4)));
    const numLevel2Subsections = Math.max(
      2,
      Math.min(6, Math.floor(maxPages / 8))
    );
    const numLevel3Subsections = Math.max(
      1,
      Math.min(4, Math.floor(maxPages / 12))
    );

    const title = formData.topic.toUpperCase();

    // Usar un objeto con las estructuras predefinidas, adaptadas según la cantidad calculada de secciones
    const structures = {
      estandar: `${title}

1. INTRODUCCIÓN
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación
   ${maxPages >= 20 ? "1.4 Alcance del estudio" : ""}
   ${maxPages >= 30 ? "1.5 Preguntas de investigación" : ""}

2. MARCO TEÓRICO
   2.1 Antecedentes
   2.2 Bases conceptuales
   ${maxPages >= 15 ? "2.3 Revisión de literatura" : ""}
   ${maxPages >= 20 ? "2.4 Enfoques teóricos relevantes" : ""}
   ${maxPages >= 30 ? "2.5 Estado actual de la cuestión" : ""}

3. DESARROLLO
   3.1 Análisis del tema principal
   3.2 Argumentación
   ${maxPages >= 15 ? "3.3 Evidencias y ejemplos" : ""}
   ${maxPages >= 20 ? "3.4 Contrastes y comparaciones" : ""}
   ${maxPages >= 30 ? "3.5 Interpretación de resultados" : ""}
   ${maxPages >= 30 ? "3.6 Discusión de hallazgos" : ""}

4. CONCLUSIONES
   4.1 Síntesis de hallazgos
   4.2 Consideraciones finales
   ${maxPages >= 15 ? "4.3 Recomendaciones" : ""}
   ${maxPages >= 20 ? "4.4 Limitaciones del estudio" : ""}
   ${maxPages >= 30 ? "4.5 Líneas futuras de investigación" : ""}

5. REFERENCIAS BIBLIOGRÁFICAS`,

      capitulos: `${title}

CAPITULO I: ASPECTOS INTRODUCTORIOS
1.1 Introducción al tema
1.2 Contexto histórico
${maxPages >= 15 ? "1.3 Antecedentes relevantes" : ""}
${maxPages >= 20 ? "1.4 Justificación del estudio" : ""}
${maxPages >= 30 ? "1.5 Planteamiento del problema" : ""}

CAPITULO II: FUNDAMENTOS TEÓRICOS
2.1 Marco conceptual
2.2 Teorías relacionadas
${maxPages >= 15 ? "2.3 Revisión de literatura" : ""}
${maxPages >= 20 ? "2.4 Modelos teóricos aplicables" : ""}
${maxPages >= 30 ? "2.5 Estudios previos" : ""}
${maxPages >= 30 ? "2.6 Definición de términos" : ""}

CAPITULO III: DESARROLLO ANALÍTICO
3.1 Metodología de análisis
3.2 Presentación de hallazgos
${maxPages >= 15 ? "3.3 Interpretación de datos" : ""}
${maxPages >= 20 ? "3.4 Discusión temática" : ""}
${maxPages >= 30 ? "3.5 Análisis comparativo" : ""}
${maxPages >= 30 ? "3.6 Evaluación de resultados" : ""}

CAPITULO IV: ANÁLISIS Y DISCUSIÓN
4.1 Análisis de resultados
4.2 Discusión de hallazgos
${maxPages >= 15 ? "4.3 Interpretación extendida" : ""}
${maxPages >= 20 ? "4.4 Implicaciones de los resultados" : ""}
${maxPages >= 30 ? "4.5 Contrastación con teorías previas" : ""}

CAPITULO V: CONCLUSIONES
5.1 Conclusiones generales
5.2 Recomendaciones
${maxPages >= 15 ? "5.3 Aplicaciones prácticas" : ""}
${maxPages >= 20 ? "5.4 Limitaciones encontradas" : ""}
${maxPages >= 30 ? "5.5 Propuestas para investigaciones futuras" : ""}

REFERENCIAS BIBLIOGRÁFICAS
${maxPages >= 20 ? "\nANEXOS" : ""}`,

      academica: `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación del estudio
   ${maxPages >= 15 ? "1.3 Alcance de la investigación" : ""}
   ${maxPages >= 20 ? "1.4 Delimitación del tema" : ""}
   ${maxPages >= 30 ? "1.5 Limitaciones de la investigación" : ""}

II. OBJETIVOS
   2.1 Objetivo general
   2.2 Objetivos específicos
   ${maxPages >= 20 ? "2.3 Preguntas de investigación" : ""}
   ${maxPages >= 30 ? "2.4 Hipótesis de trabajo" : ""}

III. MARCO TEÓRICO
   3.1 Antecedentes de la investigación
   3.2 Bases teóricas
   ${maxPages >= 15 ? "3.3 Estado del arte" : ""}
   ${maxPages >= 20 ? "3.4 Definición de términos fundamentales" : ""}
   ${maxPages >= 30 ? "3.5 Corrientes teóricas relacionadas" : ""}
   ${maxPages >= 30 ? "3.6 Marco conceptual" : ""}

IV. METODOLOGÍA
   4.1 Tipo y diseño de investigación
   4.2 Técnicas e instrumentos de recolección de datos
   ${maxPages >= 15 ? "4.3 Procedimientos metodológicos" : ""}
   ${maxPages >= 20 ? "4.4 Población y muestra" : ""}
   ${maxPages >= 20 ? "4.5 Variables de estudio" : ""}
   ${maxPages >= 30 ? "4.6 Técnicas de procesamiento de información" : ""}
   ${maxPages >= 30 ? "4.7 Consideraciones éticas" : ""}

V. RESULTADOS
   5.1 Presentación de hallazgos
   5.2 Análisis de datos obtenidos
   ${maxPages >= 15 ? "5.3 Estadísticas descriptivas" : ""}
   ${maxPages >= 20 ? "5.4 Pruebas estadísticas aplicadas" : ""}
   ${maxPages >= 30 ? "5.5 Interpretación de resultados estadísticos" : ""}

VI. DISCUSIÓN
   6.1 Interpretación de los hallazgos
   6.2 Relación con investigaciones anteriores
   ${maxPages >= 15 ? "6.3 Implicaciones teóricas" : ""}
   ${maxPages >= 20 ? "6.4 Implicaciones prácticas" : ""}
   ${maxPages >= 30 ? "6.5 Contrastación con hipótesis planteadas" : ""}

VII. CONCLUSIONES
   7.1 Conclusiones generales
   7.2 Conclusiones específicas
   ${maxPages >= 15 ? "7.3 Recomendaciones" : ""}
   ${maxPages >= 20 ? "7.4 Líneas futuras de investigación" : ""}
   ${maxPages >= 30 ? "7.5 Aportes de la investigación" : ""}

VIII. REFERENCIAS BIBLIOGRÁFICAS
${maxPages >= 20 ? "\nIX. ANEXOS" : ""}
${maxPages >= 30 ? "\nX. APÉNDICES" : ""}`,
    };

    return structures[formData.indexStructure] || structures.estandar;
  }, [formData]);

  // Función específica para generar índice de ensayo
  const generateEssayIndex = (topic, maxPages) => {
    const title = topic.toUpperCase();

    // Determinar el número de subtemas según el número de páginas
    // siguiendo la lógica de content_generator.py
    let numSubtemas = 3; // Valor por defecto
    if (maxPages <= 2) {
      numSubtemas = 2;
    } else if (maxPages <= 5) {
      numSubtemas = 3;
    } else if (maxPages <= 12) {
      numSubtemas = 4;
    } else {
      numSubtemas = 5;
    }

    // Generar subtemas genéricos
    const subtemas = [];
    for (let i = 1; i <= numSubtemas; i++) {
      subtemas.push(`        Subtema del desarrollo ${i}`);
    }

    return `${title}

I. INTRODUCCIÓN
   1.1 Planteamiento del tema
   1.2 Relevancia y contexto
   1.3 Tesis o argumento principal

II. DESARROLLO
${subtemas.join("\n")}

III. CONCLUSIÓN
   3.1 Recapitulación de puntos principales
   3.2 Síntesis del argumento global
   3.3 Reflexiones finales y proyecciones

IV. REFERENCIAS BIBLIOGRÁFICAS`;
  };

  useEffect(() => {
    const generateIndex = async () => {
      if (!formData) return;

      try {
        setIsLoading(true);
        const apiUrl = "/api";

        console.log("Enviando estructura:", formData.indexStructure);
        console.log("Enviando longitud:", formData.length);
        console.log("Enviando tipo de documento:", formData.documentType);

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
      // Asegurarnos de que el objeto formData está completo con todos los datos
      const completeFormData = {
        ...formData,
        index: generatedIndex,
        timestamp: new Date().toISOString(),
      };

      // Registrar los datos que estamos enviando para depuración
      console.log("Enviando datos a Google Sheets:", completeFormData);

      await appendToSheet(completeFormData);
      handleSuccess("¡Tu solicitud ha sido guardada correctamente!");
      navigate("/confirmacion", {
        state: {
          formData: completeFormData,
          index: generatedIndex,
        },
      });
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

  // Función para determinar nivel de detalle según cantidad de páginas
  const getDetailLevelDescription = (length) => {
    if (!length) return "estándar";

    const maxPages = length.includes("-")
      ? parseInt(length.split("-")[1])
      : parseInt(length);

    if (maxPages <= 5) return "básico (pocas secciones)";
    if (maxPages <= 15)
      return "intermedio (secciones principales bien desarrolladas)";
    if (maxPages <= 30) return "detallado (múltiples niveles y subsecciones)";
    return "muy detallado (estructura completa con múltiples niveles)";
  };

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
                        {formData.length} páginas
                        <span className="text-xs text-muted-foreground/70 ml-1">
                          (nivel de detalle{" "}
                          {getDetailLevelDescription(formData.length)})
                        </span>
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
                    {/* Información de carátula si está incluida */}
                    {formData.coverData &&
                      formData.coverData.incluirCaratula && (
                        <div>
                          <span className="text-xs sm:text-sm font-medium">
                            Carátula:
                          </span>
                          <p className="text-muted-foreground text-sm">
                            {formData.coverData.tipoInstitucion === "colegio"
                              ? "Colegio"
                              : formData.coverData.tipoInstitucion ===
                                "universidad"
                              ? "Universidad"
                              : "Instituto"}
                          </p>
                        </div>
                      )}
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
                    <div className="absolute inset-0 bg-white/80 dark:bg-background/80 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>
                          Generando índice personalizado basado en{" "}
                          {formData.length} páginas...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                  Puedes editar directamente el índice para ajustarlo a tus
                  necesidades específicas. Los cambios que realices aquí se
                  guardarán con tu pedido.
                  {apiError && (
                    <span className="block text-yellow-600 dark:text-yellow-400 mt-1">
                      Nota: {apiError}. Puedes continuar con este índice o
                      modificarlo manualmente.
                    </span>
                  )}
                </p>
              </div>

              {/* Sección de acciones finales */}
              <div className="border-t pt-3 sm:pt-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 text-xs sm:text-sm">
                          Importante antes de confirmar
                        </h4>
                        <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-0.5 sm:space-y-1">
                          <li>
                            • El índice se ha generado para un documento de{" "}
                            {formData.length} páginas
                          </li>
                          <li>
                            • Revisa que la estructura del índice sea apropiada
                            para tu tema
                          </li>
                          <li>
                            • Verifica que todos los puntos importantes estén
                            incluidos
                          </li>
                          <li>
                            • Puedes añadir o eliminar subsecciones según tus
                            necesidades
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
