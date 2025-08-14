// Mobile-optimized HomePage with reduced DOM complexity
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Zap, LayoutTemplate, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import React, { memo, useState } from "react";
import { useTheme } from "./theme-provider";
import RainbowBackground from "./RainbowBackground";

export const MobileOptimizedHomePage = memo(function MobileOptimizedHomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expandedSection, setExpandedSection] = useState(null);

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Entrega Inmediata",
      description: "Documento completo en 3-15 min",
      color: isDark ? "bg-yellow-900/30 text-yellow-200" : "bg-blue-100 text-blue-600",
    },
    {
      icon: <LayoutTemplate className="h-6 w-6" />,
      title: "3 Estructuras Disponibles", 
      description: "Estándar, extendida y académica formal",
      color: isDark ? "bg-green-900/30 text-green-200" : "bg-green-100 text-green-600",
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Formato Profesional",
      description: "Normas APA, bibliografía incluida",
      color: isDark ? "bg-blue-900/30 text-blue-200" : "bg-purple-100 text-purple-600",
    },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <RainbowBackground className="min-h-screen">
      <div className="relative min-h-screen">
        <main className="w-full">
          {/* Hero Section - Simplified */}
          <section className="pt-20 pb-12 px-4 sm:px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Generador de Documentos
                </span>
                <br />
                <span className="text-foreground">
                  Académicos con IA
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Crea documentos académicos profesionales en minutos. 
                Monografías, ensayos e informes con estructura perfecta.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link to="/configuracion">
                    <FileText className="mr-2 h-5 w-5" />
                    Crear Documento
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Features - Simplified */}
          <section className="py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  ¿Por qué elegir nuestro generador?
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 ${feature.color}`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg bg-white/20 backdrop-blur">
                        {feature.icon}
                      </div>
                      <h3 className="ml-3 text-lg font-semibold">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-sm opacity-90">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Document Preview - Simplified */}
          <section className="py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Vista previa del documento
                </h2>
              </div>

              <Card className="border border-border shadow-xl">
                <CardHeader>
                  <CardTitle>Estructura de Monografía</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "1. Portada",
                      "2. Índice General",
                      "3. Introducción",
                      "4. Desarrollo del Tema",
                      "5. Conclusiones",
                      "6. Bibliografía"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section - Simplified */}
          <section className="py-16 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-2xl p-8 border border-border">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  ¿Listo para crear tu documento académico?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Comienza ahora y obtén tu documento en minutos
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link to="/configuracion">
                    Comenzar ahora
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </RainbowBackground>
  );
});

export default MobileOptimizedHomePage;