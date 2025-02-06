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
import { FileUpload } from "./FileUpload";
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

export default function AcademicForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedStep = location.state?.currentStep ?? 0;
  const savedFormData = location.state?.formData ?? {
    documentType: "",
    topic: "",
    citationFormat: "",
    length: "",
    course: "",
    career: "",
    essayTone: "",
    additionalInfo: "",
    referenceFile: null,
    name: "",
    countryCode: "+51",
    phoneNumber: "",
  };

  const [formData, setFormData] = useState(savedFormData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(savedStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const steps = [
    { title: "Tipo de Documento", fields: ["documentType", "citationFormat"] },
    { title: "Configuración", fields: ["length", "essayTone"] },
    { title: "Contenido", fields: ["topic", "course", "career"] },
    {
      title: "Detalles Finales",
      fields: ["name", "phoneNumber", "additionalInfo"],
    },
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
      if (field === "phoneNumber" && formData[field]) {
        const phoneRegex = /^\d{9}$/;
        if (!phoneRegex.test(formData[field])) {
          newErrors[field] = "El número debe tener 9 dígitos";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsSubmitting(true);
        try {
          navigate("/preview", {
            state: {
              formData,
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
          <div>
            <span className="font-medium">Tipo de Documento:</span>
            <p className="text-muted-foreground">
              {formData.documentType || "Pendiente"}
            </p>
          </div>

          <div>
            <span className="font-medium">Tema Principal:</span>
            <p className="text-muted-foreground">
              {formData.topic || "Pendiente"}
            </p>
          </div>

          <div>
            <span className="font-medium">Formato de Citas:</span>
            <p className="text-muted-foreground">
              {formData.citationFormat || "Pendiente"}
            </p>
          </div>

          <div>
            <span className="font-medium">Longitud:</span>
            <p className="text-muted-foreground">
              {formData.length || "Pendiente"}
            </p>
          </div>

          <div>
            <span className="font-medium">Nombre:</span>
            <p className="text-muted-foreground">
              {formData.name || "Pendiente"}
            </p>
          </div>

          <div>
            <span className="font-medium">WhatsApp:</span>
            <p className="text-muted-foreground">
              {formData.countryCode && formData.phoneNumber
                ? `${formData.countryCode} ${formData.phoneNumber}`
                : "Pendiente"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {" "}
      {/* Container principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4">
        {" "}
        {/* Grid container */}
        <Card className="border-0 shadow-xl h-fit">
          <CardContent className="p-3 sm:p-6">
            {" "}
            {/* Padding más pequeño en móvil */}
            <div className="mb-4 sm:mb-8">
              <div className="flex gap-2 sm:gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      currentStep >= index && setCurrentStep(index)
                    }
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-all flex-shrink-0 text-sm sm:text-base ${
                      currentStep === index
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
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

              {/* Step 4: Final Details */}
              {currentStep === 3 && (
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
                        Instrucciones Específicas
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
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base sm:text-lg">
                        Material de Referencia
                      </Label>
                      <FileUpload
                        onFileChange={(file) =>
                          setFormData({ ...formData, referenceFile: file })
                        }
                        className="border-2 border-dashed hover:border-primary/40 hover:bg-primary/5 transition-colors"
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
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2 hover:bg-muted/80"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateStep()) {
                        setCurrentStep((prev) => prev + 1);
                      }
                    }}
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