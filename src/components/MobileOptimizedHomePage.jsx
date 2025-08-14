// Mobile-optimized HomePage with essential functionality
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Zap,
  LayoutTemplate,
  ClipboardList,
  Send,
  BadgeCheck,
  BookOpen,
  ListTree,
  Eye,
  Download,
  Calendar,
  User,
  Building,
  CheckCircle,
  Play
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { memo, useState, useRef, useEffect } from "react";
import { useTheme } from "./theme-provider";
import RainbowBackground from "./RainbowBackground";

export const MobileOptimizedHomePage = memo(function MobileOptimizedHomePage() {
  const ctaSectionRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activePreview, setActivePreview] = useState("monografia");

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

  const scrollToCTA = () => {
    ctaSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                <Button
                  onClick={scrollToCTA}
                  variant="outline"
                  size="lg"
                  className="border-border bg-background/50 backdrop-blur hover:bg-background/80 transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demo
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

          {/* Process Steps - Mobile Optimized */}
          <section className="py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Proceso simple en 4 pasos
                </h2>
                <p className="text-muted-foreground">
                  Obtén tu documento académico perfecto en minutos
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  {
                    step: "01",
                    icon: <FileText className="h-6 w-6" />,
                    title: "Configura tu documento",
                    description: "Elige el tipo, tema y especifica tus requisitos académicos"
                  },
                  {
                    step: "02", 
                    icon: <ListTree className="h-6 w-6" />,
                    title: "Selecciona la estructura",
                    description: "Escoge entre estructura estándar, extendida o académica formal"
                  },
                  {
                    step: "03",
                    icon: <Zap className="h-6 w-6" />,
                    title: "Generación automática",
                    description: "Nuestro sistema crea el documento con contenido estructurado"
                  },
                  {
                    step: "04",
                    icon: <Download className="h-6 w-6" />,
                    title: "Descarga y personaliza",
                    description: "Recibe tu documento listo para entregar o personalizar"
                  }
                ].map((process, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center relative">
                        {process.icon}
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                          {process.step}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{process.title}</h3>
                      <p className="text-sm text-muted-foreground">{process.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Document Types - Mobile Optimized */}
          <section className="py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Tipos de documentos disponibles
                </h2>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    type: "Monografías",
                    description: "Investigación profunda sobre un tema específico",
                    pages: "15-30 páginas",
                    time: "10-15 min",
                    icon: <BookOpen className="h-5 w-5" />,
                    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  },
                  {
                    type: "Ensayos Argumentativos", 
                    description: "Análisis crítico con argumentación sólida",
                    pages: "8-15 páginas",
                    time: "5-10 min", 
                    icon: <FileText className="h-5 w-5" />,
                    color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  },
                  {
                    type: "Informes Técnicos",
                    description: "Documentos especializados con metodología",
                    pages: "20-40 páginas",
                    time: "15-20 min",
                    icon: <Building className="h-5 w-5" />,
                    color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                  }
                ].map((docType, index) => (
                  <Card key={index} className={`${docType.color} transition-all duration-300 hover:shadow-lg`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-background/50">
                            {docType.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{docType.type}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{docType.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>📄 {docType.pages}</span>
                              <span>⏱️ {docType.time}</span>
                            </div>
                          </div>
                        </div>
                        <Button asChild size="sm" variant="outline">
                          <Link to="/configuracion">
                            Crear
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section - Mobile Optimized */}
          <section className="py-12 px-4 sm:px-6 bg-muted/30">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  ¿Por qué estudiantes nos eligen?
                </h2>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                    title: "100% Original",
                    description: "Contenido único generado específicamente para tu tema"
                  },
                  {
                    icon: <BadgeCheck className="h-5 w-5 text-blue-500" />,
                    title: "Normas APA",
                    description: "Formato académico profesional automático"
                  },
                  {
                    icon: <Calendar className="h-5 w-5 text-purple-500" />,
                    title: "Entrega Rápida",
                    description: "Tu documento listo en máximo 15 minutos"
                  },
                  {
                    icon: <User className="h-5 w-5 text-orange-500" />,
                    title: "Soporte 24/7",
                    description: "Ayuda personalizada vía WhatsApp"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-background border border-border">
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section - Enhanced */}
          <section ref={ctaSectionRef} className="py-16 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-2xl p-8 border border-border">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  ¿Listo para crear tu documento académico?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Únete a miles de estudiantes que ya confían en nosotros
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Link to="/configuracion">
                      <Send className="mr-2 h-5 w-5" />
                      Comenzar Ahora - Gratis
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                  >
                    <Link to="/preview">
                      <Eye className="mr-2 h-5 w-5" />
                      Ver Ejemplo
                    </Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Sin pagos ocultos • Soporte incluido • Entrega garantizada
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </RainbowBackground>
  );
});

export default MobileOptimizedHomePage;