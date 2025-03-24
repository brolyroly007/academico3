// src/pages/Confirmation.jsx
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Calendar,
  FileText,
  Phone,
  BookOpen,
} from "lucide-react";

export default function Confirmation() {
  const { state } = useLocation();
  const { formData } = state;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Card className="border-0 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-green-600">
              ¡Solicitud Confirmada!
            </h1>

            <p className="text-muted-foreground">
              Gracias {formData.name}, hemos recibido tu solicitud
              correctamente.
            </p>

            <div className="bg-muted/20 rounded-lg p-6 text-left space-y-4">
              <h3 className="font-medium text-lg">Detalles del pedido:</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>
                    {formData.documentType} - {formData.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Formato: {formData.citationFormat}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>
                    WhatsApp: {formData.countryCode} {formData.phoneNumber}
                  </span>
                </div>

                {formData.coverData && formData.coverData.incluirCaratula && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>
                      Incluye carátula:{" "}
                      {formData.coverData.tipoInstitucion === "colegio"
                        ? "Colegio"
                        : formData.coverData.tipoInstitucion === "universidad"
                        ? "Universidad"
                        : "Instituto"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Te contactaremos por WhatsApp para coordinar los detalles y el
                pago. Revisa tu WhatsApp en los próximos minutos.
              </p>

              <Button asChild>
                <Link to="/">Volver al Inicio</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
