// src/components/GarantiaCalidad.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, CheckCircle, Clock, ArrowLeft, FileText } from "lucide-react";
import RainbowBackground from "./RainbowBackground";

export default function GarantiaCalidad() {
  return (
    <RainbowBackground>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        
        {/* Botón de regreso */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Hero section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Garantía de Calidad
          </h1>
          <p className="text-muted-foreground">
            Nuestros compromisos contigo
          </p>
        </div>

        {/* Garantías principales */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Formato APA 7 garantizado</h3>
                  <p className="text-sm text-muted-foreground">Todas las citas y referencias según estándares académicos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Entrega en máximo 48 horas</h3>
                  <p className="text-sm text-muted-foreground">Tu documento listo en el tiempo acordado</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Revisión gratuita</h3>
                  <p className="text-sm text-muted-foreground">Ajustes menores sin costo dentro de 48 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Contenido original</h3>
                  <p className="text-sm text-muted-foreground">Cada documento único y personalizado</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Soporte post-entrega</h3>
                  <p className="text-sm text-muted-foreground">Te ayudamos después de la entrega</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link to="/configuracion">
            <Button className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
              <FileText className="h-5 w-5 mr-2" />
              Crear Mi Documento
            </Button>
          </Link>
        </div>
      </div>
    </RainbowBackground>
  );
}