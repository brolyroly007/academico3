// src/pages/Confirmation.jsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Calendar,
  FileText,
  Phone,
  BookOpen,
  Home,
  Edit3,
  Save,
  X,
  Loader,
} from "lucide-react";
import RainbowBackground from "./RainbowBackground";
import { appendToSheet } from "../services/googleSheets";
import { handleError, handleSuccess } from "../utils/errorHandler";
import { useEffect, useState } from "react";

// Códigos de país disponibles
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

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { formData, index } = state || {};
  
  // Estados para editar número
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedCountryCode, setEditedCountryCode] = useState(formData?.countryCode || "+51");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(formData?.phoneNumber || "");
  const [isResubmitting, setIsResubmitting] = useState(false);
  
  // Funciones para manejar cambios - REPLICANDO EXACTAMENTE handleConfirm de IndexPreview
  const handleSavePhone = async () => {
    console.log("[DEBUG] handleSavePhone - Iniciando resubmisión con:");
    console.log("[DEBUG] editedCountryCode:", editedCountryCode);
    console.log("[DEBUG] editedPhoneNumber:", editedPhoneNumber);
    console.log("[DEBUG] formData original:", formData);
    console.log("[DEBUG] index:", index);
    
    // Validar número
    if (!editedPhoneNumber.trim()) {
      alert("Por favor ingresa un número válido");
      return;
    }
    
    // Validar formato del número
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(editedPhoneNumber.trim())) {
      alert("Por favor ingresa un número de teléfono válido (8-15 dígitos)");
      return;
    }
    
    setIsResubmitting(true);
    
    try {
      // EXACTAMENTE como en IndexPreview: Asegurarnos de que el objeto formData está completo
      const completeFormData = {
        ...formData,
        // Actualizar el número
        countryCode: editedCountryCode,
        phoneNumber: editedPhoneNumber.trim(),
        // EXACTAMENTE como en IndexPreview: incluir el índice
        index: index || formData.index || "",
        // EXACTAMENTE como en IndexPreview: timestamp
        timestamp: new Date().toISOString(),
        // Campos adicionales para marcar como reenvío
        phoneUpdatedAt: new Date().toISOString(),
        isResubmission: true,
        originalTimestamp: formData.timestamp || formData.newTimestamp || new Date().toISOString(),
      };
      
      // EXACTAMENTE como en IndexPreview: Registrar los datos que estamos enviando
      console.log("[DEBUG] Enviando datos completos a Google Sheets:", completeFormData);
      
      // EXACTAMENTE como en IndexPreview: llamar a appendToSheet
      console.log("[DEBUG] Llamando a appendToSheet...");
      await appendToSheet(completeFormData);
      console.log("[DEBUG] appendToSheet completado exitosamente");
      
      // EXACTAMENTE como en IndexPreview: mostrar mensaje de éxito
      handleSuccess("¡Tu solicitud ha sido reenviada correctamente!");
      
      // Actualizar el estado local
      Object.assign(formData, {
        countryCode: editedCountryCode,
        phoneNumber: editedPhoneNumber.trim()
      });
      
      // Salir del modo edición
      setIsEditingPhone(false);
      
    } catch (error) {
      console.error("[ERROR] Error completo al reenviar solicitud:", error);
      console.error("[ERROR] Stack trace:", error.stack);
      
      // Mensaje de error más específico
      let errorMessage = "Error al reenviar la solicitud";
      if (error.message) {
        errorMessage += ": " + error.message;
      }
      
      handleError(error, errorMessage);
    } finally {
      setIsResubmitting(false);
    }
  };
  
  // EXACTAMENTE como handleBack en IndexPreview
  const handleReturnToForm = () => {
    console.log("[DEBUG] handleReturnToForm - FormData recibido:", formData);
    console.log("[DEBUG] handleReturnToForm - Navegando a step 4 con state:", {
      formData,
      currentStep: 4,
      maxVisitedStep: 4,
    });
    
    navigate("/configuracion", {
      state: {
        formData,
        currentStep: 4, // EXACTAMENTE como en IndexPreview - Detalles finales es step 4
        maxVisitedStep: 4, // EXACTAMENTE como en IndexPreview - Importante para permitir la navegación
      },
    });
  };
  
  // Verificar que tenemos los datos necesarios
  if (!formData) {
    navigate("/configuracion");
    return null;
  }

  // Configurar animaciones al cargar la página
  useEffect(() => {
    document.documentElement.classList.remove("no-js");

    // Animaciones iniciales con delay escalonado
    setTimeout(() => {
      const initialElements = document.querySelectorAll(
        ".animate-on-scroll-initial"
      );
      initialElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("animate-active");
        }, index * 100);
      });
    }, 200);

    if ("IntersectionObserver" in window) {
      const animateItems = document.querySelectorAll(
        ".animate-on-scroll:not(.animate-on-scroll-initial)"
      );

      // Observador para animaciones
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                entry.target.classList.add("animate-active");
              }, 50);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -5% 0px",
        }
      );

      // Observar elementos con delay
      animateItems.forEach((item, index) => {
        setTimeout(() => {
          observer.observe(item);
        }, index * 10);
      });

      return () => {
        animateItems.forEach((item) => {
          observer.unobserve(item);
        });
      };
    }
  }, []);

  return (
    <RainbowBackground>
      <div className="min-h-[100dvh] w-full px-4 py-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-md animate-on-scroll animate-on-scroll-initial fade-up">
            <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="flex justify-center animate-on-scroll bounce-in delay-200">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-green-500/20 blur-lg scale-150 animate-pulse"></div>
                  <div className="relative rounded-full bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 p-4 shadow-xl border border-green-200/50 dark:border-green-700/50">
                    <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="animate-on-scroll fade-up delay-300">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  ¡Solicitud Confirmada!
                </h1>
              </div>

              <div className="animate-on-scroll fade-up delay-400">
                <p className="text-muted-foreground text-lg">
                  Gracias <span className="font-semibold text-primary">{formData.name}</span>, hemos recibido tu solicitud correctamente.
                </p>
              </div>

              <div className="bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg p-6 text-left space-y-4 border border-border/50 shadow-lg animate-on-scroll elastic-in delay-500">
                <h3 className="font-medium text-lg flex items-center gap-2">
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-1.5 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Detalles del pedido:</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/30">
                    <div className="bg-gradient-to-r from-blue-500/20 to-blue-400/10 p-2 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-500" />
                    </div>
                    <span className="text-lg font-medium">
                      {formData.documentType} - {formData.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/30">
                    <div className="bg-gradient-to-r from-purple-500/20 to-purple-400/10 p-2 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-500" />
                    </div>
                    <span className="text-lg">Formato: <span className="font-medium">{formData.citationFormat}</span></span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-green-500/20 to-green-400/10 p-2 rounded-lg">
                        <Phone className="w-6 h-6 text-green-500" />
                      </div>
                      {!isEditingPhone ? (
                        <span className="text-lg">
                          WhatsApp: <span className="font-medium">{formData.countryCode} {formData.phoneNumber}</span>
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-lg">WhatsApp:</span>
                          <Select value={editedCountryCode} onValueChange={setEditedCountryCode} disabled={isResubmitting}>
                            <SelectTrigger className="w-32 h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRY_CODES.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            value={editedPhoneNumber}
                            onChange={(e) => setEditedPhoneNumber(e.target.value)}
                            placeholder="Número de teléfono"
                            disabled={isResubmitting}
                            className="w-40 h-9"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!isEditingPhone ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingPhone(true)}
                          className="text-green-700 dark:text-green-400 hover:bg-green-200/50 dark:hover:bg-green-800/50"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Cambiar
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSavePhone}
                            disabled={isResubmitting}
                            className="text-green-700 dark:text-green-400 hover:bg-green-200/50 dark:hover:bg-green-800/50 disabled:opacity-50"
                          >
                            {isResubmitting ? (
                              <>
                                <Loader className="w-4 h-4 mr-1 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-1" />
                                Reenviar
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingPhone(false);
                              setEditedCountryCode(formData.countryCode);
                              setEditedPhoneNumber(formData.phoneNumber);
                            }}
                            disabled={isResubmitting}
                            className="text-red-700 dark:text-red-400 hover:bg-red-200/50 dark:hover:bg-red-800/50 disabled:opacity-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {formData.coverData && formData.coverData.incluirCaratula && (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/30">
                      <div className="bg-gradient-to-r from-orange-500/20 to-orange-400/10 p-2 rounded-lg">
                        <BookOpen className="w-6 h-6 text-orange-500" />
                      </div>
                      <span className="text-lg">
                        Incluye carátula: <span className="font-medium">
                        {formData.coverData.tipoInstitucion === "colegio"
                          ? "Colegio"
                          : formData.coverData.tipoInstitucion === "universidad"
                          ? "Universidad"
                          : "Instituto"}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 animate-on-scroll fade-up delay-600">
                <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-4">
                  <p className="text-base text-blue-700 dark:text-blue-300">
                    Te contactaremos por WhatsApp para coordinar los detalles y el pago. Revisa tu WhatsApp en los próximos minutos.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-muted/20 to-muted/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110" />
                    <Button
                      variant="outline"
                      onClick={handleReturnToForm}
                      className="relative w-full h-12 text-base rounded-xl border-2 border-border/50 hover:border-border/80 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                    >
                      <Edit3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">Modificar Datos</span>
                    </Button>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110" />
                    <Button asChild className="relative w-full h-12 text-base rounded-xl bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground border-2 border-primary/50 hover:border-primary/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group"
                      style={{
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}>
                      <Link to="/" className="flex items-center justify-center gap-2">
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-bold tracking-wide">Volver al Inicio</span>
                        {/* Brillo animado */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out rounded-xl" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </RainbowBackground>
  );
}
