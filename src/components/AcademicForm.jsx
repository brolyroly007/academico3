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
  Shield,
  Zap,
  BadgeCheck,
  CheckCircle,
} from "lucide-react";

// Importamos los nuevos componentes de seguridad
import ReCaptcha from "./ReCaptcha";
import PrivacyTerms from "./PrivacyTerms";
import { useTheme } from "./theme-provider"; // Importamos el hook de tema
import RainbowBackground from "./RainbowBackground"; // Importamos el fondo de HomePage

// Tipos de documento - Ensayo marcado como "Próximamente"
const DOCUMENT_TYPES = [
  {
    value: "monografia",
    label: "Monografía",
    icon: <BookOpen className="w-4 h-4" />,
    available: true,
  },
  {
    value: "ensayo",
    label: "Ensayo", // Quitado el "(Próximamente)"
    icon: <FileText className="w-4 h-4" />,
    available: true, // Cambiado a true para habilitarlo
  },
];

// Formatos de citación - Solo APA disponible
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

const ESSAY_LENGTHS = [
  { value: "1-5", label: "1-5 páginas" },
  { value: "5-10", label: "5-10 páginas" },
  { value: "10-15", label: "10-15 páginas" },
  { value: "15-20", label: "15-20 páginas" },
];

const TONOS_REDACCIÓN = [
  { value: "académico", label: "Académico Formal" },
  { value: "analítico", label: "Analítico Crítico" },
  { value: "narrativo", label: "Narrativo Descriptivo" },
];

const ESSAY_TYPES = [
  { 
    value: "argumentativo", 
    label: "Ensayo argumentativo",
    description: "El autor defiende una tesis (punto de vista) presentando argumentos sólidos y evidencias para convencer al lector.",
    popular: true // Marcar como el más común
  },
  { 
    value: "expositivo", 
    label: "Ensayo expositivo",
    description: "Su propósito es informar y explicar un tema de forma clara, ordenada y objetiva, sin emitir juicios personales."
  },
  { 
    value: "descriptivo", 
    label: "Ensayo descriptivo",
    description: "Presenta una descripción detallada de personas, lugares, objetos o situaciones, desde una perspectiva subjetiva."
  },
  { 
    value: "narrativo", 
    label: "Ensayo narrativo",
    description: "Relata una historia o un suceso, pudiendo incluir elementos de reflexión personal."
  },
  { 
    value: "persuasivo", 
    label: "Ensayo persuasivo",
    description: "Similar al argumentativo, busca convencer al lector apelando tanto a la razón como a la emoción y la resonancia moral."
  },
  { 
    value: "comparacion_contraste", 
    label: "Ensayo de comparación y contraste",
    description: "Analiza las similitudes y diferencias entre dos o más elementos, conceptos o ideas."
  },
  { 
    value: "literario", 
    label: "Ensayo literario",
    description: "Combina la reflexión sobre un tema con un estilo formal, estético y cuidado, propio de la literatura."
  },
  { 
    value: "cientifico", 
    label: "Ensayo científico",
    description: "Aborda un tema de las ciencias (naturales, sociales o formales) con rigor metodológico y evidencia empírica."
  }
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
  const { theme } = useTheme(); // Accedemos al tema actual
  const isDark = theme === "dark";

  // Recuperar el paso y datos guardados
  const savedStep = location.state?.currentStep ?? 0;
  const maxVisitedStep = location.state?.maxVisitedStep ?? savedStep;
  const phoneChanged = location.state?.phoneChanged ?? false;
  
  // DEBUG: Verificar qué estado estamos recibiendo
  console.log("[DEBUG] AcademicForm - location.state recibido:", location.state);
  console.log("[DEBUG] AcademicForm - savedStep:", savedStep);
  console.log("[DEBUG] AcademicForm - maxVisitedStep:", maxVisitedStep);
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
    // Nuevos campos de seguridad
    recaptchaToken: "",
    privacyAccepted: false,
  };

  // Estados
  const [formData, setFormData] = useState(savedFormData);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(savedStep);
  
  // DEBUG: Monitorear cambios en currentStep
  useEffect(() => {
    console.log("[DEBUG] AcademicForm - currentStep cambió a:", currentStep);
  }, [currentStep]);

  // Scroll al top cuando cambia el paso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [maxStep, setMaxStep] = useState(maxVisitedStep);

  // Estados para seguridad
  const [recaptchaToken, setRecaptchaToken] = useState(
    savedFormData.recaptchaToken || ""
  );
  const [privacyAccepted, setPrivacyAccepted] = useState(
    savedFormData.privacyAccepted || false
  );
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [securitySectionExpanded, setSecuritySectionExpanded] = useState(false);
  const [showPhoneChangeMessage, setShowPhoneChangeMessage] = useState(phoneChanged);
  
  // Efecto para mostrar mensaje de cambio de número
  useEffect(() => {
    if (phoneChanged) {
      setTimeout(() => {
        setShowPhoneChangeMessage(false);
      }, 5000); // Ocultar después de 5 segundos
    }
  }, [phoneChanged]);

  // Función para actualizar los datos de la carátula
  const handleCoverDataChange = (coverData) => {
    setFormData((prev) => ({
      ...prev,
      coverData,
    }));
  };


  // Función para manejar la verificación de reCAPTCHA
  const handleRecaptchaVerify = (token) => {
    try {
      setRecaptchaToken(token);
      setRecaptchaError(false);

      // Actualizar formData con el token real
      setFormData((prev) => ({
        ...prev,
        recaptchaToken: token,
      }));
      
      console.log("reCAPTCHA token recibido correctamente");
    } catch (error) {
      console.error("Error al manejar token reCAPTCHA:", error);
      setRecaptchaError(true);
    }
  };

  // Manejar cambio en la aceptación de políticas
  const handlePrivacyChange = (accepted) => {
    setPrivacyAccepted(accepted);
    // Actualizar formData
    setFormData((prev) => ({
      ...prev,
      privacyAccepted: accepted,
    }));

    // Limpiar error de política de privacidad si se acepta
    if (accepted) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.privacyAccepted;
        return newErrors;
      });
    }
  };

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

  // Efecto para limpiar errores cuando se cambian los valores de los campos
  useEffect(() => {
    // Crear una función para limpiar los errores de los campos que cambian
    const clearFieldErrors = () => {
      const newErrors = { ...errors };

      // Verificar cada campo del formulario
      if (formData.name && errors.name) {
        delete newErrors.name;
      }

      if (formData.phoneNumber && errors.phoneNumber) {
        // Verificar formato del número telefónico
        const phoneRegex = /^\d{9}$/;
        if (phoneRegex.test(formData.phoneNumber)) {
          delete newErrors.phoneNumber;
        }
      }

      // Verificar otros campos
      Object.keys(formData).forEach((key) => {
        if (formData[key] && errors[key]) {
          delete newErrors[key];
        }
      });

      // Actualizar estado de errores solo si hay cambios
      if (Object.keys(errors).length !== Object.keys(newErrors).length) {
        setErrors(newErrors);
      }
    };

    clearFieldErrors();
  }, [formData, errors]);

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

    // En el último paso, validar la aceptación de política (pero fuera del bucle fields)
    if (currentStep === steps.length - 1) {
      if (!privacyAccepted) {
        newErrors.privacyAccepted = "Debes aceptar la política de privacidad";
      }

      // Verificar si tenemos un token de reCAPTCHA con timeout
      if (!recaptchaToken) {
        // Dar un poco más de tiempo para reCAPTCHA
        setTimeout(() => {
          if (!recaptchaToken) {
            setRecaptchaError(true);
            newErrors.recaptcha = "Error en la verificación de seguridad";
          }
        }, 2000);
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleStepChange = (step) => {
    // No permitir seleccionar el paso de estructura si es ensayo
    if (formData.documentType === "ensayo" && step === 3) {
      // Si es ensayo e intenta ir al paso de estructura, saltar al siguiente paso
      if (validateStep()) {
        if (step + 1 <= maxStep) {
          setCurrentStep(step + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
      return;
    }

    // Validar el paso actual antes de permitir el cambio
    if (validateStep()) {
      if (step <= maxStep) {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    let prevStep = currentStep - 1;

    // Si es ensayo y el paso anterior es estructura de índice, saltar ese paso
    if (formData.documentType === "ensayo" && prevStep === 3) {
      prevStep = 2;
    }

    setCurrentStep(prevStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        handleNextStep();
      } else {
        setIsSubmitting(true);
        try {
          // Asegurar que la estructura de datos es compatible con el backend
          const dataToSend = {
            ...formData,
            // Asegurar que la longitud está en el formato que espera content_generator.py
            length: formData.length, // Ya debe estar en formato "10-15", "15-20", etc.
            // Asegurar que el tipo de documento es uno de los esperados
            documentType: formData.documentType.toLowerCase(), // Asegurar minúsculas
            // Incluir datos de seguridad
            recaptchaToken: recaptchaToken,
            privacyAccepted: privacyAccepted,
          };

          console.log("Datos a enviar:", dataToSend);
          navigate("/preview", {
            state: {
              formData: dataToSend,
              currentStep: steps.length - 1,
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

  // Definición de pasos del formulario
  const steps = [
    { title: "Tipo de Documento", fields: ["documentType", "citationFormat"] },
    { title: "Configuración", fields: ["length", "essayTone"] },
    { title: "Contenido", fields: ["topic", "course", "career"] },
    { title: "Estructura de Índice", fields: ["indexStructure"] },
    { title: "Detalles Finales", fields: ["name", "phoneNumber"] },
  ];

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
              <span className="font-medium">{formData.documentType === "ensayo" ? "Tipo de Ensayo:" : "Tono de Redacción:"}</span>
              <p className="text-muted-foreground">
                {formData.documentType === "ensayo" 
                  ? ESSAY_TYPES.find(type => type.value === formData.essayTone)?.label || formData.essayTone
                  : TONOS_REDACCIÓN.find(tono => tono.value === formData.essayTone)?.label || formData.essayTone
                }
              </p>
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


          {/* Mostrar estado de verificación de seguridad */}
          <div className="pt-3 border-t mt-3">
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Seguridad:
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  privacyAccepted && recaptchaToken
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {privacyAccepted && recaptchaToken ? "Verificado" : "Pendiente"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <RainbowBackground>
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
            
            {/* Mensaje de cambio de número */}
            {showPhoneChangeMessage && (
              <div className="mb-6 animate-on-scroll fade-up">
                <div className="bg-gradient-to-r from-green-50/80 to-green-100/60 dark:from-green-950/30 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      Número de teléfono actualizado correctamente. Puedes continuar o enviar el formulario.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
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
                        onValueChange={(value) => {
                          // Solo permitir seleccionar tipos disponibles
                          const selectedType = DOCUMENT_TYPES.find(
                            (type) => type.value === value
                          );
                          if (selectedType && selectedType.available) {
                            setFormData({ ...formData, documentType: value });
                            // Limpiar el error al seleccionar un valor
                            if (errors.documentType) {
                              setErrors({ ...errors, documentType: undefined });
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 sm:h-12 hover:border-primary/80 transition-colors">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_TYPES.map((type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value}
                              disabled={!type.available}
                              className={`hover:bg-primary/10 transition-colors ${
                                !type.available
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
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
                        onValueChange={(value) => {
                          // Solo permitir seleccionar formatos disponibles
                          const selectedFormat = CITATION_FORMATS.find(
                            (format) => format.value === value
                          );
                          if (selectedFormat && selectedFormat.available) {
                            setFormData({ ...formData, citationFormat: value });
                            // Limpiar el error al seleccionar un valor
                            if (errors.citationFormat) {
                              setErrors({
                                ...errors,
                                citationFormat: undefined,
                              });
                            }
                          }
                        }}
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
                        onValueChange={(value) => {
                          setFormData({ ...formData, length: value });
                          // Limpiar el error al seleccionar un valor
                          if (errors.length) {
                            setErrors({ ...errors, length: undefined });
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 sm:h-12 hover:border-primary/80 transition-colors">
                          <SelectValue placeholder="Seleccionar longitud" />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.documentType === "ensayo" ? ESSAY_LENGTHS : DOCUMENT_LENGTHS).map((length) => (
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
                        {formData.documentType === "ensayo" ? "Tipo de Ensayo *" : "Tono de Redacción *"}
                      </Label>
                      <Select
                        value={formData.essayTone}
                        onValueChange={(value) => {
                          setFormData({ ...formData, essayTone: value });
                          // Limpiar el error al seleccionar un valor
                          if (errors.essayTone) {
                            setErrors({ ...errors, essayTone: undefined });
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 sm:h-12 hover:border-primary/80 transition-colors">
                          <SelectValue placeholder={formData.documentType === "ensayo" ? "Seleccionar tipo de ensayo" : "Seleccionar tono"} />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.documentType === "ensayo" ? ESSAY_TYPES : TONOS_REDACCIÓN).map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="hover:bg-primary/10 cursor-pointer relative group"
                            >
                              <div className="w-full">
                                <div className="font-medium text-left flex items-center gap-2">
                                  {option.label}
                                  {option.popular && (
                                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-sm">
                                      Más común
                                    </span>
                                  )}
                                </div>
                                {/* Tooltip que aparece solo en hover para ensayos */}
                                {formData.documentType === "ensayo" && option.description && (
                                  <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                      {option.description}
                                    </div>
                                    {/* Flecha del tooltip */}
                                    <div className="absolute -top-1 left-4 w-2 h-2 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-600 transform rotate-45"></div>
                                  </div>
                                )}
                              </div>
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
                        onChange={(e) => {
                          setFormData({ ...formData, topic: e.target.value });
                          // Limpiar el error si el campo tiene al menos 3 caracteres
                          if (e.target.value.length >= 3 && errors.topic) {
                            setErrors({ ...errors, topic: undefined });
                          }
                        }}
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
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              course: e.target.value,
                            });
                            // Limpiar el error si el campo tiene al menos 2 caracteres
                            if (e.target.value.length >= 2 && errors.course) {
                              setErrors({ ...errors, course: undefined });
                            }
                          }}
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
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              career: e.target.value,
                            });
                            // Limpiar el error si el campo tiene al menos 2 caracteres
                            if (e.target.value.length >= 2 && errors.career) {
                              setErrors({ ...errors, career: undefined });
                            }
                          }}
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

                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 mb-6">
                      <div className="flex gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                            Importante
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-500">
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
                            // Limpiar error de estructura
                            if (errors.indexStructure) {
                              setErrors({
                                ...errors,
                                indexStructure: undefined,
                              });
                            }
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

                              {/* Ejemplo visual - Mejorado para contraste */}
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
                                          ? isDark
                                            ? "text-blue-300 font-semibold"
                                            : "text-blue-600 font-semibold"
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
                              // Limpiar error de estructura
                              if (errors.indexStructure) {
                                setErrors({
                                  ...errors,
                                  indexStructure: undefined,
                                });
                              }
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

                                {/* Ejemplos visuales - Mejorado para contraste */}
                                <div className="mt-3 p-3 bg-muted/40 rounded-md text-sm border border-muted font-mono">
                                  {structure.example
                                    .split("\n")
                                    .map((line, idx) => (
                                      <div
                                        key={idx}
                                        className={`${
                                          line.includes("CAPITULO")
                                            ? isDark
                                              ? "text-blue-300 font-semibold"
                                              : "text-blue-600 font-semibold"
                                            : line.match(/^[IVX]+\./)
                                            ? isDark
                                              ? "text-blue-300 font-semibold"
                                              : "text-blue-600 font-semibold"
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

              {/* Step 5: Final Details */}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, name: value });
                          // Limpiar error si el campo es válido
                          if (value.length >= 2 && errors.name) {
                            setErrors({ ...errors, name: undefined });
                          }
                        }}
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
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 9);
                            setFormData({
                              ...formData,
                              phoneNumber: value,
                            });
                            // Limpiar error si el número tiene 9 dígitos
                            if (value.length === 9 && errors.phoneNumber) {
                              setErrors({ ...errors, phoneNumber: undefined });
                            }
                          }}
                          placeholder="Número de WhatsApp (9 dígitos)"
                          className="flex-1 h-10 sm:h-12"
                          type="tel"
                          maxLength={9}
                          pattern="[0-9]{9}"
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

                    {/* Sección de seguridad - Aceptación de Política de Privacidad */}
                    <div className="pt-4 mt-2 border-t border-border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Seguridad y Privacidad
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSecuritySectionExpanded(!securitySectionExpanded)
                          }
                          className="text-xs"
                        >
                          {securitySectionExpanded ? "Colapsar" : "Expandir"}{" "}
                          información
                        </Button>
                      </div>

                      {securitySectionExpanded && (
                        <div className="mb-4 bg-muted/20 p-4 rounded-lg border border-muted animate-fade-in">
                          <h4 className="font-medium mb-2">
                            ¿Por qué solicitamos esta información?
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            Implementamos verificaciones para mantener la
                            seguridad de nuestro servicio y de tus datos:
                          </p>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                La verificación reCAPTCHA ayuda a prevenir
                                abusos automatizados
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                Solicitamos tu aceptación explícita para enviar
                                comunicaciones a tu WhatsApp
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                Tus datos personales se usan exclusivamente para
                                la entrega de este servicio
                              </span>
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* Componente de aceptación de política de privacidad */}
                      <PrivacyTerms
                        value={privacyAccepted}
                        onChange={handlePrivacyChange}
                      />

                      {errors.privacyAccepted && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.privacyAccepted}
                        </p>
                      )}

                      {/* Componente ReCaptcha invisible */}
                      <div className="mt-4">
                        <ReCaptcha
                          onVerify={handleRecaptchaVerify}
                          action="academic_form_submit"
                        />

                        {recaptchaError && (
                          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900 rounded-md">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm text-red-700 dark:text-red-400">
                                  Error en la verificación de seguridad. Por
                                  favor, recarga la página e inténtalo de nuevo.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {recaptchaToken && !recaptchaError && (
                          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900 rounded-md">
                            <div className="flex items-start gap-2">
                              <Shield className="w-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                  Verificación de seguridad completada
                                  correctamente
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Sección de carátula - Añadir aquí */}
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

        {/* Guía para completar el formulario */}
        <div className="mt-12 space-y-6">
          
          {/* Guía extensa - parte 1 y 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Guía paso a paso - Parte 1 */}
            <Card className="bg-slate-50/50 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <BookOpen className="h-5 w-5" />
                  Guía completa del proceso (Parte 1)
                </h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-2">Selección del tipo de documento</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Monografía:</strong> Trabajos de investigación extensos, ideales para tesis de grado, proyectos universitarios profundos con múltiples capítulos y análisis detallado.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Ensayo:</strong> Trabajos argumentativos con estructura clara: introducción, desarrollo de argumentos y conclusión. Perfectos para análisis críticos y reflexiones académicas.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-2">Configuración de longitud y tono</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>10-15 páginas:</strong> Trabajos básicos, ensayos cortos, informes preliminares.
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>20-30 páginas:</strong> Monografías estándar, trabajos finales de curso.
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>30-45 páginas:</strong> Investigaciones profundas, tesis de pregrado.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Tono académico:</strong> Formal, objetivo, con terminología técnica apropiada.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-2">Definición del contenido</h4>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                        ✅ <strong>Tema específico:</strong> "Impacto de las redes sociales en la salud mental de adolescentes de 15-18 años"
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400 mb-2">
                        ❌ <strong>Muy general:</strong> "Redes sociales y adolescentes"
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Incluye curso/asignatura específica y área de estudio para contextualizar mejor el trabajo.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guía paso a paso - Parte 2 */}
            <Card className="bg-stone-50/50 dark:bg-stone-900/20 border-stone-200/50 dark:border-stone-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-stone-700 dark:text-stone-300">
                  <FileText className="h-5 w-5" />
                  Guía completa del proceso (Parte 2)
                </h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-stone-100 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-2">Estructura del índice</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Estándar:</strong> Introducción → Desarrollo → Conclusión. Para trabajos generales y ensayos.
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Por Capítulos:</strong> División temática numerada. Ideal para monografías extensas con múltiples subtemas.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Académica:</strong> Con objetivos, marco teórico, metodología. Para investigaciones formales.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-stone-100 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      5
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-2">Datos de contacto y entrega</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>WhatsApp:</strong> Único medio de entrega del documento. Verifica que esté correcto.
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        <strong>Instrucciones adicionales:</strong> Menciona formatos específicos de tu universidad, estilo de citas particular, etc.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Carátula opcional:</strong> Incluye datos de tu institución educativa si lo requieres.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-stone-100 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      6
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm mb-2">Notificación y pago</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        📱 <strong>Te notificaremos por WhatsApp</strong> con los detalles de pago una vez recibida tu solicitud.
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        💳 <strong>Proceso de pago:</strong> Realizas el pago y envías el comprobante por WhatsApp.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        📄 <strong>Generación del trabajo:</strong> El documento se genera una vez validado el comprobante de pago (3-15 min).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Consejos y ejemplos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consejos importantes */}
            <Card className="bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-200/50 dark:border-zinc-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <AlertTriangle className="h-5 w-5" />
                  Consejos importantes antes de enviar
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-zinc-100/50 dark:bg-zinc-800/20 rounded-lg p-3 text-center">
                    <Phone className="h-6 w-6 text-zinc-600 dark:text-zinc-400 mx-auto mb-2" />
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm mb-1">WhatsApp correcto</h4>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">
                      Único medio de entrega
                    </p>
                  </div>
                  
                  <div className="bg-zinc-100/50 dark:bg-zinc-800/20 rounded-lg p-3 text-center">
                    <FileText className="h-6 w-6 text-zinc-600 dark:text-zinc-400 mx-auto mb-2" />
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm mb-1">Formato específico</h4>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">
                      Menciónalo en instrucciones
                    </p>
                  </div>

                  <div className="bg-zinc-100/50 dark:bg-zinc-800/20 rounded-lg p-3 text-center">
                    <BadgeCheck className="h-6 w-6 text-zinc-600 dark:text-zinc-400 mx-auto mb-2" />
                    <h4 className="font-medium text-zinc-800 dark:text-zinc-200 text-sm mb-1">Entrega rápida</h4>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">
                      3-15 min según páginas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ejemplos de temas populares */}
            <Card className="bg-gray-50/50 dark:bg-gray-900/20 border-gray-200/50 dark:border-gray-700/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Zap className="h-5 w-5" />
                  Ejemplos de temas populares por carrera
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-100/50 dark:bg-gray-800/20 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">Psicología</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Ansiedad estudiantil</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Bullying académico</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Psicología laboral</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100/50 dark:bg-gray-800/20 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">Administración</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Liderazgo moderno</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Marketing digital</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Gestión del talento</p>
                    </div>
                  </div>

                  <div className="bg-gray-100/50 dark:bg-gray-800/20 rounded-lg p-3">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-2">Derecho</h4>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Derechos digitales</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Violencia familiar</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">• Derecho ambiental</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
        </div>
      </div>
    </RainbowBackground>
  );
}
