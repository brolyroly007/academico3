// src/components/AcademicForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoverGenerator } from "./CoverGenerator";
import { ProgressIndicator } from "./ProgressIndicator";
import { handleError } from "../utils/errorHandler";
import {
  Loader,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Info,
  ClipboardList,
  Phone,
  User,
  AlertTriangle,
  ListTree,
} from "lucide-react";

const DOCUMENT_TYPES = [
  { value: "ensayo", label: "Ensayo", icon: <FileText className="w-4 h-4" /> },
  {
    value: "monografia",
    label: "Monografía",
    icon: <BookOpen className="w-4 h-4" />,
  },
];

// Formatos de citación modificados para incluir "Próximamente" y disponibilidad
const CITATION_FORMATS = [
  { value: "APA", label: "APA 7", available: true },
  { value: "MLA", label: "MLA (Próximamente)", available: false },
  { value: "Chicago", label: "Chicago (Próximamente)", available: false },
  { value: "Vancouver", label: "Vancouver (Próximamente)", available: false },
];

const DOCUMENT_LENGTHS = [
  { value: "10-15", label: "10-15 páginas" },
  { value: "15-20", label: "15-20 páginas" },
  { value: "20-30", label: "20-30 páginas" },
  { value: "30-45", label: "30-45 páginas" },
];

const TONOS_REDACCIÓN = [
  { value: "académico", label: "Académico Formal" },
  { value: "analítico", label: "Analítico Crítico" },
  { value: "narrativo", label: "Narrativo Descriptivo" },
];

const COUNTRY_CODES = [
  { value: "+51", label: "Perú (+51)" },
  { value: "+56", label: "Chile (+56)" },
  { value: "+57", label: "Colombia (+57)" },
  { value: "+52", label: "México (+52)" },
  { value: "+54", label: "Argentina (+54)" },
  { value: "+593", label: "Ecuador (+593)" },
  { value: "+58", label: "Venezuela (+58)" },
  { value: "+34", label: "España (+34)" },
];

const SUGERIDOS_TEMAS = [
  "Impacto de la IA en la educación moderna",
  "Cambio climático y sostenibilidad",
  "Evolución de las redes sociales",
  "Avances en medicina genética",
];

const INDEX_STRUCTURES = [
  {
    value: "estandar",
    label: "Estructura Estándar",
    description:
      "Organización tradicional con introducción, desarrollo y conclusiones",
    icon: <FileText className="h-5 w-5" />,
    // Añadir ejemplo de visualización
    example: `1. Introducción
   1.1 Contextualización
   1.2 Objetivos
   1.3 Justificación

2. Desarrollo
   2.1 Subtema principal
   2.2 Análisis detallado
   2.3 Desarrollo extendido

3. Conclusiones
   3.1 Síntesis
   3.2 Consideraciones finales

4. Referencias bibliográficas`,
  },
  {
    value: "capitulos",
    label: "Por Capítulos",
    description: "División en capítulos numerados con subsecciones detalladas",
    icon: <ListTree className="h-5 w-5" />,
    // Añadir ejemplo de visualización
    example: `CAPITULO I: INTRODUCCIÓN
1.1 Introducción al tema
1.2 Contexto histórico
1.3 Antecedentes relevantes

CAPITULO II: DESARROLLO
2.1 Desarrollo conceptual
2.2 Análisis detallado
2.3 Profundización temática

CAPITULO III: ANÁLISIS
3.1 Análisis de resultados
3.2 Discusión de hallazgos
3.3 Interpretación extendida

CAPITULO IV: CONCLUSIONES
4.1 Conclusiones
4.2 Recomendaciones
4.3 Perspectivas futuras

Referencias bibliográficas`,
  },
  {
    value: "academica",
    label: "Estructura Académica",
    description: "Formato académico con objetivos, marco teórico y metodología",
    icon: <BookOpen className="h-5 w-5" />,
    // Añadir ejemplo de visualización
    example: `I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación
   1.3 Alcance del estudio

II. OBJETIVOS
   2.1 Objetivo general
   2.2 Objetivos específicos
   2.3 Preguntas de investigación

III. MARCO TEÓRICO
    3.1 Antecedentes
    3.2 Bases teóricas
    3.3 Estado del arte

IV. METODOLOGÍA
    4.1 Tipo de investigación
    4.2 Técnicas e instrumentos
    4.3 Procedimientos metodológicos

V. RESULTADOS Y DISCUSIÓN
   5.1 Presentación de resultados
   5.2 Análisis de hallazgos
   5.3 Discusión extendida

VI. CONCLUSIONES
    6.1 Conclusiones
    6.2 Recomendaciones
    6.3 Líneas futuras de investigación

VII. REFERENCIAS BIBLIOGRÁFICAS`,
  },
];

// Añadir una estructura especial para ensayos
const ESSAY_STRUCTURE = {
  value: "ensayo",
  label: "Estructura de Ensayo",
  description: "Formato específico para ensayos académicos",
  icon: <FileText className="h-5 w-5" />,
  example: `I. INTRODUCCIÓN
   1.1 Planteamiento del tema
   1.2 Relevancia y contexto
   1.3 Tesis o argumento principal

II. DESARROLLO
   2.1 Primer argumento
      2.1.1 Evidencias y ejemplos
      2.1.2 Análisis del argumento
   
   2.2 Segundo argumento
      2.2.1 Evidencias y ejemplos
      2.2.2 Análisis del argumento
   
   2.3 Tercer argumento
      2.3.1 Evidencias y ejemplos
      2.3.2 Análisis del argumento
   
   2.4 Contraargumentos
      2.4.1 Presentación de posturas contrarias
      2.4.2 Refutación de contraargumentos

III. CONCLUSIÓN
   3.1 Recapitulación de puntos principales
   3.2 Síntesis del argumento global
   3.3 Reflexiones finales y proyecciones

IV. REFERENCIAS BIBLIOGRÁFICAS`,
};

// Función para obtener el nivel de detalle basado en la longitud
const getDetailLevelByLength = (length) => {
  if (!length) return "básico";

  const maxPages = parseInt(length.split("-")[1]);

  if (maxPages <= 15) return "básico";
  if (maxPages <= 20) return "intermedio";
  if (maxPages <= 30) return "detallado";
  return "muy detallado";
};

export default function AcademicForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Recuperar el paso y datos guardados
  const savedStep = location.state?.currentStep ?? 0;
  const maxVisitedStep = location.state?.maxVisitedStep ?? savedStep;
  const savedFormData = location.state?.formData ?? {
    documentType: "",
    topic: "",
    citationFormat: "",
    length: "",
    course: "",
    career: "",
    essayTone: "",
    additionalInfo: "",
    name: "",
    countryCode: "+51",
    phoneNumber: "",
    indexStructure: "",
    coverData: {
      incluirCaratula: false,
    },
  };

  // Estados
  const [formData, setFormData] = useState(savedFormData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(savedStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [maxStep, setMaxStep] = useState(maxVisitedStep);

  // Función para actualizar los datos de la carátula
  const handleCoverDataChange = (coverData) => {
    setFormData((prev) => ({
      ...prev,
      coverData,
    }));
  };

  // Definición de pasos del formulario
  const steps = [
    { title: "Tipo de Documento", fields: ["documentType", "citationFormat"] },
    { title: "Configuración", fields: ["length", "essayTone"] },
    { title: "Contenido", fields: ["topic", "course", "career"] },
    { title: "Estructura de Índice", fields: ["indexStructure"] },
    { title: "Detalles Finales", fields: ["name", "phoneNumber"] },
  ];

  // Efecto para actualizar sugerencias de temas
  useEffect(() => {
    if (currentStep === 2 && formData.topic) {
      const matches = SUGERIDOS_TEMAS.filter((tema) =>
        tema.toLowerCase().includes(formData.topic.toLowerCase())
      );
      setSuggestions(matches);
    }
  }, [formData.topic, currentStep]);

  // Efecto para asignar estructura estándar automáticamente cuando es ensayo
  useEffect(() => {
    if (formData.documentType === "ensayo" && !formData.indexStructure) {
      setFormData((prev) => ({
        ...prev,
        indexStructure: "estandar",
      }));
    }
  }, [formData.documentType]);

  const calculateProgress = () => {
    // Calcular el total de pasos considerando si se debe omitir el paso de estructura para ensayos
    const totalSteps =
      formData.documentType === "ensayo" ? steps.length - 1 : steps.length;

    // Ajustar el paso actual si es ensayo y está después del paso de estructura
    let adjustedCurrentStep = currentStep;
    if (formData.documentType === "ensayo" && currentStep > 3) {
      adjustedCurrentStep -= 1;
    }

    return ((adjustedCurrentStep + 1) / totalSteps) * 100;
  };

  const validateStep = () => {
    const currentFields = steps[currentStep].fields;
    const newErrors = {};

    currentFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Este campo es obligatorio";
      }

      // Validación específica para número de teléfono
      if (field === "phoneNumber" && formData[field]) {
        const phoneRegex = /^\d{9}$/;
        if (!phoneRegex.test(formData[field])) {
          newErrors[field] = "El número debe tener 9 dígitos";
        }
      }

      // Validación específica para estructura de índice
      if (
        field === "indexStructure" &&
        !["estandar", "capitulos", "academica"].includes(formData[field])
      ) {
        newErrors[field] = "Selecciona una estructura válida";
      }

      // Validación de longitud para el tema
      if (field === "topic" && formData[field] && formData[field].length < 3) {
        newErrors[field] = "El tema debe tener al menos 3 caracteres";
      }

      // Validación para el curso y carrera
      if (
        (field === "course" || field === "career") &&
        formData[field] &&
        formData[field].length < 2
      ) {
        newErrors[field] = "Este campo debe tener al menos 2 caracteres";
      }

      // Validación para el nombre
      if (field === "name" && formData[field] && formData[field].length < 2) {
        newErrors[field] = "El nombre debe tener al menos 2 caracteres";
      }
    });

    setErrors(newErrors);
    console.log("Errores de validación:", newErrors);
    console.log("Campos actuales:", currentFields);
    console.log("Datos del formulario:", formData);

    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = (step) => {
    // No permitir seleccionar el paso de estructura si es ensayo
    if (formData.documentType === "ensayo" && step === 3) {
      // Si es ensayo e intenta ir al paso de estructura, saltar al siguiente paso
      if (validateStep()) {
        if (step + 1 <= maxStep) {
          setCurrentStep(step + 1);
        }
      }
      return;
    }

    // Validar el paso actual antes de permitir el cambio
    if (validateStep()) {
      if (step <= maxStep) {
        setCurrentStep(step);
      }
    } else {
      // Si no pasa la validación, mantener el paso actual
      console.log("Validación fallida para el paso actual");
    }
  };

  const handleNextStep = () => {
    if (validateStep()) {
      let nextStep = currentStep + 1;

      // Si es ensayo y el siguiente paso es estructura de índice, saltar ese paso
      if (formData.documentType === "ensayo" && nextStep === 3) {
        nextStep = 4; // Saltar al paso de detalles finales
      }

      setCurrentStep(nextStep);
      setMaxStep(Math.max(maxStep, nextStep));
    }
  };

  const handleBack = () => {
    let prevStep = currentStep - 1;

    // Si es ensayo y el paso anterior es estructura de índice, saltar ese paso
    if (formData.documentType === "ensayo" && prevStep === 3) {
      prevStep = 2;
    }

    setCurrentStep(prevStep);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        handleNextStep();
      } else {
        setIsSubmitting(true);
        try {
          console.log("Datos a enviar:", {
            ...formData,
          });
          navigate("/preview", {
            state: {
              formData,
              currentStep: steps.length - 1, // Aseguramos que esté en el último paso
              maxVisitedStep: steps.length - 1,
            },
          });
        } catch (error) {
          handleError(error, "Error al procesar el formulario");
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const SummaryPanel = () => (
    <Card className="bg-muted/50 border-primary/20 sticky top-8 h-fit">
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Resumen del Pedido</h3>
        </div>

        <div className="space-y-3 text-sm">
          {/* Siempre mostrar la información básica si existe */}
          {formData.documentType && (
            <div>
              <span className="font-medium">Tipo de Documento:</span>
              <p className="text-muted-foreground">{formData.documentType}</p>
            </div>
          )}

          {formData.topic && (
            <div>
              <span className="font-medium">Tema Principal:</span>
              <p className="text-muted-foreground">{formData.topic}</p>
            </div>
          )}

          {formData.citationFormat && (
            <div>
              <span className="font-medium">Formato de Citas:</span>
              <p className="text-muted-foreground">{formData.citationFormat}</p>
            </div>
          )}

          {formData.length && (
            <div>
              <span className="font-medium">Longitud:</span>
              <p className="text-muted-foreground">{formData.length}</p>
            </div>
          )}

          {formData.course && (
            <div>
              <span className="font-medium">Curso:</span>
              <p className="text-muted-foreground">{formData.course}</p>
            </div>
          )}

          {formData.career && (
            <div>
              <span className="font-medium">Área de Estudio:</span>
              <p className="text-muted-foreground">{formData.career}</p>
            </div>
          )}

          {formData.essayTone && (
            <div>
              <span className="font-medium">Tono de Redacción:</span>
              <p className="text-muted-foreground">{formData.essayTone}</p>
            </div>
          )}

          {/* Mostrar estructura de índice si ya fue seleccionada */}
          {formData.indexStructure && (
            <div>
              <span className="font-medium">Estructura del Índice:</span>
              <p className="text-muted-foreground">
                {formData.documentType === "ensayo"
                  ? "Estructura de Ensayo"
                  : INDEX_STRUCTURES.find(
                      (s) => s.value === formData.indexStructure
                    )?.label || "Estructura Estándar"}
              </p>
            </div>
          )}

          {/* Mostrar datos de contacto si ya fueron ingresados */}
          {formData.name && (
            <div>
              <span className="font-medium">Nombre:</span>
              <p className="text-muted-foreground">{formData.name}</p>
            </div>
          )}

          {formData.phoneNumber && (
            <div>
              <span className="font-medium">WhatsApp:</span>
              <p className="text-muted-foreground">
                {formData.countryCode} {formData.phoneNumber}
              </p>
            </div>
          )}

          {formData.additionalInfo && (
            <div>
              <span className="font-medium">Instrucciones Adicionales:</span>
              <p className="text-muted-foreground">{formData.additionalInfo}</p>
            </div>
          )}

          {/* Mostrar si se incluye carátula */}
          {formData.coverData && formData.coverData.incluirCaratula && (
            <div>
              <span className="font-medium">Carátula:</span>
              <p className="text-muted-foreground">
                {formData.coverData.tipoInstitucion === "colegio"
                  ? "Colegio"
                  : formData.coverData.tipoInstitucion === "universidad"
                  ? "Universidad"
                  : formData.coverData.tipoInstitucion === "instituto"
                  ? "Instituto"
                  : "Incluida"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
        <Card className="border-0 shadow-xl h-fit">
          <CardContent className="p-3 sm:p-6">
            <div className="mb-4 sm:mb-8">
              <div className="flex gap-2 sm:gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {steps.map((step, index) => {
                  // Ocultar el paso de estructura si el tipo es ensayo
                  if (formData.documentType === "ensayo" && index === 3) {
                    return null;
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleStepChange(index)}
                      disabled={index > maxStep}
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all flex-shrink-0 text-sm sm:text-base ${
                        currentStep === index
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : index <= maxStep
                          ? "bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer"
                          : "bg-muted/50 text-muted-foreground/50 cursor-not-allowed"
                      }`}
                    >
                      <span className="font-medium truncate">{step.title}</span>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
              <ProgressIndicator
                progress={calculateProgress()}
                status={`Paso ${currentStep + 1} de ${
                  formData.documentType === "ensayo"
                    ? steps.length - 1
                    : steps.length
                }: ${steps[currentStep].title}`}
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Step 1: Document Type */}
              {currentStep === 0 && (
                <div className="space-y-4 sm:space-y-6 animate-fade-in">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-base sm:text-lg">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                        Tipo de Documento *
                      </Label>
                      <Select
                        value={formData.documentType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, documentType: value })
                        }
                      >
                        <SelectTrigger className="h-10 sm:h-12 hover:border-primary/80 transition-colors">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_TYPES.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              className="hover:bg-primary/10 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {type.icon}
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.documentType && (
                        <p className="text-red-500 text-sm">
                          {errors.documentType}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-base sm:text-lg">
                        <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                        Formato de Citas *
                      </Label>
                      <Select
                        value={formData.citationFormat}
                        onValueChange={(value) =>
                          setFormData({ ...formData, citationFormat: value })
                        }
                      >
                        <SelectTrigger className="h-10 sm:h-12 hover:border-primary/80 transition-colors">
                          <SelectValue placeholder="Seleccionar formato" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITATION_FORMATS.map((format) => (
                            <SelectItem
                              key={format.value}
                              value={format.value}
                              disabled={!format.available}
                              className={`hover:bg-primary/10 ${
                                !format.available
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.citationFormat && (
                        <p className="text-red-500 text-sm">
                          {errors.citationFormat}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Configuration */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6 animate-fade-in">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-base sm:text-lg">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                        Longitud del Documento *
                      </Label>
                      <Select
                        value={formData.length}
                        onValueChange={(value) =>
                          setFormData({ ...formData, length: value })
                        }
                      >
                        <SelectTrigger className="h-10 sm:h-12 hover:border-primary/80 transition-colors">
                          <SelectValue placeholder="Seleccionar longitud" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_LENGTHS.map((length) => (
                            <SelectItem
                              key={length.value}
                              value={length.value}
                              className="hover:bg-primary/10"
                            >
                              {length.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.length && (
                        <p className="text-red-500 text-sm">{errors.length}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-base sm:text-lg">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                        Tono de Redacción *
                      </Label>
                      <Select
                        value={formData.essayTone}
                        onValueChange={(value) =>
                          setFormData({ ...formData, essayTone: value })
                        }
                      >
                        <SelectTrigger className="h-10 sm:h-12 hover:border-primary/80 transition-colors">
                          <SelectValue placeholder="Seleccionar tono" />
                        </SelectTrigger>
                        <SelectContent>
                          {TONOS_REDACCIÓN.map((tono) => (
                            <SelectItem
                              key={tono.value}
                              value={tono.value}
                              className="hover:bg-primary/10"
                            >
                              {tono.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.essayTone && (
                        <p className="text-red-500 text-sm">
                          {errors.essayTone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Content */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6 animate-fade-in">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="text-base sm:text-lg">
                        Tema Principal *
                      </Label>
                      <Input
                        value={formData.topic}
                        onChange={(e) =>
                          setFormData({ ...formData, topic: e.target.value })
                        }
                        placeholder="Comience a escribir para ver sugerencias..."
                        className="h-10 sm:h-12 hover:border-primary/80 transition-colors"
                        list="sugerencias-temas"
                      />
                      <datalist id="sugerencias-temas">
                        {suggestions.map((tema, index) => (
                          <option key={index} value={tema} />
                        ))}
                      </datalist>
                      {errors.topic && (
                        <p className="text-red-500 text-sm">{errors.topic}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-base sm:text-lg">
                          Curso/Asignatura *
                        </Label>
                        <Input
                          value={formData.course}
                          onChange={(e) =>
                            setFormData({ ...formData, course: e.target.value })
                          }
                          placeholder="Nombre del curso"
                          className="h-10 sm:h-12 hover:border-primary/80 transition-colors"
                        />
                        {errors.course && (
                          <p className="text-red-500 text-sm">
                            {errors.course}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-base sm:text-lg">
                          Área de Estudio *
                        </Label>
                        <Input
                          value={formData.career}
                          onChange={(e) =>
                            setFormData({ ...formData, career: e.target.value })
                          }
                          placeholder="Nombre de la carrera"
                          className="h-10 sm:h-12 hover:border-primary/80 transition-colors"
                        />
                        {errors.career && (
                          <p className="text-red-500 text-sm">
                            {errors.career}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Index Structure - Solo mostrar si NO es ensayo */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">
                      Elige la estructura para tu índice
                    </h3>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 mb-1">
                            Importante
                          </h4>
                          <p className="text-sm text-yellow-700">
                            {formData.documentType === "ensayo"
                              ? "Para ensayos, se utilizará una estructura especializada con introducción, desarrollo y conclusión."
                              : "La estructura del índice se adaptará automáticamente según el número de páginas seleccionado (" +
                                formData.length +
                                "), con un nivel de detalle " +
                                getDetailLevelByLength(formData.length) +
                                "."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {formData.documentType === "ensayo" ? (
                        // Mostrar solo la estructura de ensayo si es un ensayo
                        <div
                          className="p-4 rounded-lg border-2 border-primary bg-primary/10"
                          onClick={() => {
                            console.log("Estructura seleccionada: ensayo");
                            setFormData({
                              ...formData,
                              indexStructure: "estandar", // Usamos estandar como valor, pero mostramos la estructura de ensayo
                            });
                          }}
                        >
                          <div className="flex gap-4">
                            <div className="flex items-center">
                              <div className="w-5 h-5 rounded-full border border-primary bg-primary">
                                <div className="w-3 h-3 rounded-full bg-white m-auto mt-1" />
                              </div>
                            </div>

                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                {ESSAY_STRUCTURE.icon}
                                <span className="font-medium text-lg">
                                  {ESSAY_STRUCTURE.label}
                                </span>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                {ESSAY_STRUCTURE.description}
                              </p>

                              {/* Ejemplo visual */}
                              <div className="mt-3 p-3 bg-muted/40 rounded-md text-sm border border-muted font-mono">
                                {ESSAY_STRUCTURE.example
                                  .split("\n")
                                  .map((line, idx) => (
                                    <div
                                      key={idx}
                                      className={`${
                                        line.startsWith("I") ||
                                        line.startsWith("II") ||
                                        line.startsWith("III") ||
                                        line.startsWith("IV")
                                          ? "text-primary-foreground/80"
                                          : ""
                                      }`}
                                    >
                                      {line.startsWith("   ") ? (
                                        <span className="ml-4">
                                          {line.trim()}
                                        </span>
                                      ) : line.startsWith("      ") ? (
                                        <span className="ml-8">
                                          {line.trim()}
                                        </span>
                                      ) : (
                                        line
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Mostrar las opciones normales para otros tipos de documentos
                        INDEX_STRUCTURES.map((structure) => (
                          <div
                            key={structure.value}
                            className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:bg-muted/30 ${
                              formData.indexStructure === structure.value
                                ? "border-primary bg-primary/10"
                                : "border-transparent"
                            }`}
                            onClick={() => {
                              console.log(
                                "Estructura seleccionada:",
                                structure.value
                              );
                              setFormData({
                                ...formData,
                                indexStructure: structure.value,
                              });
                            }}
                          >
                            <div className="flex gap-4">
                              <div className="flex items-center">
                                <div
                                  className={`w-5 h-5 rounded-full border ${
                                    formData.indexStructure === structure.value
                                      ? "border-primary bg-primary"
                                      : "border-gray-400"
                                  }`}
                                >
                                  {formData.indexStructure ===
                                    structure.value && (
                                    <div className="w-3 h-3 rounded-full bg-white m-auto mt-1" />
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  {structure.icon}
                                  <span className="font-medium text-lg">
                                    {structure.label}
                                  </span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  {structure.description}
                                </p>

                                {/* Ejemplos visuales */}
                                <div className="mt-3 p-3 bg-muted/40 rounded-md text-sm border border-muted font-mono">
                                  {structure.example
                                    .split("\n")
                                    .map((line, idx) => (
                                      <div
                                        key={idx}
                                        className={`${
                                          line.includes("CAPITULO") ||
                                          line.match(/^[IVX]+\./)
                                            ? "text-primary-foreground/80"
                                            : line.match(/^\d+\./)
                                            ? "font-medium"
                                            : ""
                                        }`}
                                      >
                                        {line.startsWith("   ") ? (
                                          <span className="ml-4">
                                            {line.trim()}
                                          </span>
                                        ) : (
                                          line
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {errors.indexStructure && (
                      <p className="text-red-500 text-sm">
                        {errors.indexStructure}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Final Details (ahora es el paso 5, antes era el 4) */}
              {currentStep === 4 && (
                <div className="space-y-4 sm:space-y-6 animate-fade-in">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base sm:text-lg flex items-center gap-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        Nombre o Apodo *
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="¿Cómo te gustaría que te llamemos?"
                        className="h-10 sm:h-12 hover:border-primary/80 transition-colors"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base sm:text-lg flex items-center gap-2">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        WhatsApp para envío *
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select
                          value={formData.countryCode}
                          onValueChange={(value) =>
                            setFormData({ ...formData, countryCode: value })
                          }
                        >
                          <SelectTrigger className="w-full sm:w-[140px] h-10 sm:h-12">
                            <SelectValue placeholder="Código" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_CODES.map((code) => (
                              <SelectItem key={code.value} value={code.value}>
                                {code.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phoneNumber: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 9),
                            })
                          }
                          placeholder="Número de WhatsApp (9 dígitos)"
                          className="flex-1 h-10 sm:h-12"
                          type="tel"
                          maxLength={9}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.phoneNumber}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Por este medio te enviaremos el documento y podremos
                        resolver cualquier duda
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base sm:text-lg">
                        Instrucciones Específicas (opcional)
                      </Label>
                      <Textarea
                        value={formData.additionalInfo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            additionalInfo: e.target.value,
                          })
                        }
                        placeholder="Ej: Requerimientos especiales, estructura específica..."
                        className="min-h-[100px] sm:min-h-[120px] hover:border-primary/80 transition-colors"
                      />
                      <p className="text-sm text-muted-foreground">
                        Campo opcional: puedes proporcionar detalles adicionales
                        si lo deseas
                      </p>
                    </div>

                    {/* Sección de carátula */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-4">
                        Opciones de Presentación
                      </h3>
                      <CoverGenerator
                        setCoverData={handleCoverDataChange}
                        coverData={formData.coverData || {}}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-4 sm:mt-6">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2 hover:bg-muted/80"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2 hover:bg-primary/90"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2 hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                        Procesando...
                      </>
                    ) : (
                      "Revisar Índice"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Panel de resumen versión desktop */}
        <div className="hidden lg:block">
          <SummaryPanel />
        </div>
        {/* Panel de resumen versión móvil */}
        <div className="block lg:hidden">
          <Card className="bg-muted/50 border-primary/20">
            <CardContent className="p-4">
              <SummaryPanel />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
