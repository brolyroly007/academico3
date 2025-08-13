// src/components/TerminosServicio.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Scale, Clock, ArrowLeft, FileText } from "lucide-react";
import RainbowBackground from "./RainbowBackground";

export default function TerminosServicio() {
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
              <Scale className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Términos de Servicio
          </h1>
          <p className="text-muted-foreground">
            Condiciones simples y claras
          </p>
        </div>

        {/* Servicios */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Nuestros Servicios</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Monografías académicas con formato APA 7</p>
              <p>• Ensayos argumentativos y analíticos</p>
              <p>• Informes técnicos de investigación</p>
              <p>• Estructuras de índice personalizables</p>
              <p>• Carátulas institucionales</p>
            </div>
          </CardContent>
        </Card>

        {/* Tiempos de entrega */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Tiempos de Entrega</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Documentos hasta 20 páginas: 24-36 horas</p>
              <p>• Documentos de 20-45 páginas: 36-48 horas</p>
              <p>• Revisiones menores: gratuitas dentro de 48 horas</p>
              <p>• Correcciones de formato APA: siempre gratuitas</p>
            </div>
          </CardContent>
        </Card>

        {/* Responsabilidades */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Nuestras Responsabilidades</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Entregar documentos de calidad académica</p>
              <p>• Cumplir con formato APA 7 correctamente</p>
              <p>• Mantener confidencialidad absoluta</p>
              <p>• Proporcionar soporte post-entrega</p>
              <p>• Crear contenido original y personalizado</p>
            </div>
          </CardContent>
        </Card>

        {/* Uso responsable */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Uso Responsable</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Los documentos son material de apoyo académico</p>
              <p>• Recomendamos personalizarlos a tu estilo</p>
              <p>• Una vez entregado, el documento es tuyo</p>
              <p>• Cumple con las normas de tu universidad</p>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground">Importante:</p>
              <p className="text-sm text-muted-foreground">No garantizamos calificaciones específicas.</p>
            </div>
          </CardContent>
        </Card>

        {/* Cancelaciones */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Cancelaciones</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Antes de iniciar: cancelación completa sin costo</p>
              <p>• Trabajo en progreso: reembolso parcial según avance</p>
              <p>• Después de entrega: no aplican cancelaciones</p>
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Contacto</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Para dudas sobre estos términos:
            </p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>WhatsApp:</strong> +51 961484114</p>
              <p><strong>Email:</strong> asdw12365@gmail.com</p>
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