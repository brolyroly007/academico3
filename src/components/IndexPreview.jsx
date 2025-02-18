// src/components/IndexPreview.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCheck, AlertCircle, ChevronLeft, List } from "lucide-react";
import { appendToSheet } from "../services/googleSheets";
import { handleError, handleSuccess } from "../utils/errorHandler";
import { ProgressIndicator } from "./ProgressIndicator";
import DocumentService from "../services/DocumentService";

function IndexPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [generatedIndex, setGeneratedIndex] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const generateIndex = async () => {
      if (!formData) return;

      try {
        const payload = {
          documentType: formData.documentType,
          topic: formData.topic,
          length: formData.length,
          additionalInfo: formData.additionalInfo || "",
        };

        console.log("Generando índice con payload:", payload);

        const index = await DocumentService.generateIndex(payload);
        setGeneratedIndex(index);
      } catch (error) {
        console.error("Error de red completo:", error);
        console.error("Tipo de error:", error.name);
        console.error("Mensaje de error:", error.message);

        handleError(error);
        setGeneratedIndex(`1. Introducción
2. Desarrollo
   2.1 Contexto
   2.2 Análisis
   2.3 Discusión
3. Conclusiones
4. Referencias bibliográficas`);
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
      handleSuccess("¡Tu solicitud ha sido confirmada!");
      navigate("/confirmacion", {
        state: {
          formData,
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
        currentStep: 3, // Volver al último paso (Detalles Finales)
      },
    });
  };

  if (!formData) {
    navigate("/configuracion");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Header */}
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

            {/* Resumen del Pedido */}
            <div className="bg-muted/20 rounded-lg p-4">
              <h3 className="font-medium mb-3">Resumen del pedido:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tipo:</span>
                  <p className="text-muted-foreground">
                    {formData.documentType}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Tema:</span>
                  <p className="text-muted-foreground">{formData.topic}</p>
                </div>
                <div>
                  <span className="font-medium">Formato:</span>
                  <p className="text-muted-foreground">
                    {formData.citationFormat}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Longitud:</span>
                  <p className="text-muted-foreground">{formData.length}</p>
                </div>
              </div>
            </div>

            {/* Indicador de Progreso */}
            {isLoading && (
              <ProgressIndicator
                progress={50}
                status="Generando índice... Por favor espera"
              />
            )}

            {/* Índice Editable */}
            <div className="bg-muted/20 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                Revisa y ajusta el índice según tus necesidades
              </h3>
              <div className="relative">
                <Textarea
                  value={generatedIndex}
                  onChange={(e) => setGeneratedIndex(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  disabled={isLoading}
                  placeholder={isLoading ? "Generando índice..." : ""}
                />
              </div>
            </div>

            {/* Footer con Acciones */}
            <div className="border-t pt-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Al confirmar, se generará tu pedido con el índice ajustado.
                  Podrás realizar cambios adicionales contactándonos por
                  WhatsApp.
                </p>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="gap-2"
                    disabled={isLoading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Modificar datos
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={isSubmitting || isLoading}
                    className="gap-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    {isSubmitting ? "Procesando..." : "Confirmar y Enviar"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IndexPreview;
