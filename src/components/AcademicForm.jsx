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

const CITATION_FORMATS = [
  { value: "APA", label: "APA" },
  { value: "MLA", label: "MLA" },
  { value: "Chicago", label: "Chicago" },
];

const DOCUMENT_LENGTHS = [
  { value: "corto", label: "Corto (2-4 páginas)" },
  { value: "medio", label: "Medio (5-8 páginas)" },
  { value: "largo", label: "Largo (9-12 páginas)" },
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
  },
  {
    value: "capitulos",
    label: "Por Capítulos",
    description: "División en capítulos numerados con subsecciones detalladas",
    icon: <ListTree className="h-5 w-5" />,
  },
  {
    value: "academica",
    label: "Estructura Académica",
    description: "Formato académico con objetivos, marco teórico y metodología",
    icon: <BookOpen className="h-5 w-5" />,
  },
];

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
  };

  // Estados
  const [formData, setFormData] = useState(savedFormData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(savedStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [maxStep, setMaxStep] = useState(maxVisitedStep);

  const steps = [
    { title: "Tipo de Documento", fields: ["documentType", "citationFormat"] },
    { title: "Configuración", fields: ["length", "essayTone"] },
    { title: "Contenido", fields: ["topic", "course", "career"] },
    { title: "Estructura de Índice", fields: ["indexStructure"] },
    { title: "Detalles Finales", fields: ["name", "phoneNumber"] },
  ];

  useEffect(() => {
    if (currentStep === 2 && formData.topic) {
      const matches = SUGERIDOS_TEMAS.filter((tema) =>
        tema.toLowerCase().includes(formData.topic.toLowerCase())
      );
      setSuggestions(matches);
    }
  }, [formData.topic, currentStep]);

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
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
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStep(Math.max(maxStep, nextStep));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
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
                {INDEX_STRUCTURES.find(
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
                {steps.map((step, index) => (
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
                ))}
              </div>
              <ProgressIndicator
                progress={calculateProgress()}
                status={`Paso ${currentStep + 1} de ${steps.length}: ${
                  steps[currentStep].title
                }`}
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
                              className="hover:bg-primary/10"
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

              {/* Step 4: Index Structure (ahora es el paso 4 en lugar del 5) */}
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
                            La estructura del índice solo puede seleccionarse
                            una vez. Si deseas cambiarla después, necesitarás
                            completar el formulario nuevamente.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {INDEX_STRUCTURES.map((structure) => (
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
                                {structure.value === "estandar" ? (
                                  <>
                                    <div className="text-primary-foreground/80">
                                      Título del documento
                                    </div>
                                    <div className="ml-2">1. Introducción</div>
                                    <div className="ml-2">2. Desarrollo</div>
                                    <div className="ml-4">
                                      2.1 Subtema principal
                                    </div>
                                    <div className="ml-4">2.2 Análisis</div>
                                    <div className="ml-2">3. Conclusiones</div>
                                    <div className="ml-2">
                                      4. Referencias bibliográficas
                                    </div>
                                  </>
                                ) : structure.value === "capitulos" ? (
                                  <>
                                    <div className="text-primary-foreground/80">
                                      Título del documento
                                    </div>
                                    <div className="ml-2">CAPITULO I</div>
                                    <div className="ml-4">
                                      1.1 Introducción al tema
                                    </div>
                                    <div className="ml-4">
                                      1.2 Contexto histórico
                                    </div>
                                    <div className="ml-2">CAPITULO II</div>
                                    <div className="ml-4">
                                      2.1 Desarrollo conceptual
                                    </div>
                                    <div className="ml-4">
                                      2.2 Análisis detallado
                                    </div>
                                    <div className="ml-2">CAPITULO III</div>
                                    <div className="ml-4">3.1 Conclusiones</div>
                                    <div className="ml-4">
                                      3.2 Recomendaciones
                                    </div>
                                    <div className="ml-2">
                                      Referencias bibliográficas
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-primary-foreground/80">
                                      Título del documento
                                    </div>
                                    <div className="ml-2">I. Introducción</div>
                                    <div className="ml-4">
                                      1.1 Planteamiento del problema
                                    </div>
                                    <div className="ml-4">
                                      1.2 Justificación
                                    </div>
                                    <div className="ml-2">II. Objetivos</div>
                                    <div className="ml-4">
                                      2.1 Objetivo general
                                    </div>
                                    <div className="ml-4">
                                      2.2 Objetivos específicos
                                    </div>
                                    <div className="ml-2">
                                      III. Marco Teórico
                                    </div>
                                    <div className="ml-4">3.1 Antecedentes</div>
                                    <div className="ml-4">
                                      3.2 Bases teóricas
                                    </div>
                                    <div className="ml-2">IV. Metodología</div>
                                    <div className="ml-4">
                                      4.1 Tipo de investigación
                                    </div>
                                    <div className="ml-4">
                                      4.2 Técnicas e instrumentos
                                    </div>
                                    <div className="ml-2">V. Conclusiones</div>
                                    <div className="ml-2">
                                      VI. Referencias Bibliográficas
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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