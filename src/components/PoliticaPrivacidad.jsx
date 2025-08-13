// src/components/PoliticaPrivacidad.jsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, ArrowLeft, FileText } from "lucide-react";
import RainbowBackground from "./RainbowBackground";

export default function PoliticaPrivacidad() {
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
            Política de Privacidad
          </h1>
          <p className="text-muted-foreground">
            Cómo protegemos tu información
          </p>
        </div>

        {/* Información que recopilamos */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Información que Recopilamos</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Nombre o apodo para personalizar el servicio</p>
              <p>• Número de WhatsApp para comunicación y entrega</p>
              <p>• Detalles del proyecto académico solicitado</p>
              <p>• Universidad y carrera para personalizar el formato</p>
            </div>
          </CardContent>
        </Card>

        {/* Cómo usamos la información */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Cómo Usamos tu Información</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Para crear tu documento académico personalizado</p>
              <p>• Para comunicarnos contigo sobre el progreso</p>
              <p>• Para entregar el documento finalizado</p>
              <p>• Para brindar soporte post-entrega</p>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground">Lo que NO hacemos:</p>
              <p className="text-sm text-muted-foreground">No vendemos, compartimos ni usamos tu información para publicidad.</p>
            </div>
          </CardContent>
        </Card>

        {/* Protección de datos */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Protección de Datos</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Encriptación SSL en todas las comunicaciones</p>
              <p>• Almacenamiento seguro en servidores protegidos</p>
              <p>• Acceso limitado solo a nuestro equipo</p>
              <p>• Eliminación automática de datos después de la entrega</p>
            </div>
          </CardContent>
        </Card>

        {/* Retención de datos */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Retención de Datos</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Datos del proyecto: eliminados 30 días después de la entrega</p>
              <p>• Información de contacto: conservada 90 días para soporte</p>
              <p>• Documentos creados: eliminados inmediatamente tras la entrega</p>
            </div>
          </CardContent>
        </Card>

        {/* Contacto */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Contacto</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Para preguntas sobre privacidad, contáctanos:
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