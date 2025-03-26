// src/components/HomePage.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Zap,
  LayoutTemplate,
  ClipboardList,
  Send,
  BadgeCheck,
  Check,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";
import SlideUpAnimation from "./SlideUpAnimation";
import Felix from "./Felix";
import Felix from "./SimplifiedFelix";

export function HomePage() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Generación Express",
      description: "Entrega inmediata con confirmación por WhatsApp",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <LayoutTemplate className="h-6 w-6" />,
      title: "Plantillas Académicas",
      description: "Estructuras predefinidas para diferentes formatos",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Edición Flexible",
      description: "Personaliza índice y estructura previa a generación",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Cumplimiento Normativo",
      description: "Formatos APA, Vancouver, MLA y Chicago",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <AnimatedBackground>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 w-full px-6 py-8 md:py-16">
          {/* Hero Section */}
          <section className="text-center mb-16 md:mb-24 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-8">
              <SlideUpAnimation delay={100}>
                <div className="inline-flex items-center bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-shadow">
                  <Send className="h-4 w-4 mr-2" />
                  Generación académica automatizada
                </div>
              </SlideUpAnimation>

              <SlideUpAnimation delay={200}>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-tight [text-wrap:balance]">
                  <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                    Precisión Automatizada
                  </span>
                  <br />
                  en Redacción Académica
                </h1>
              </SlideUpAnimation>

              <SlideUpAnimation delay={300}>
                <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed [text-wrap:balance]">
                  Sistema inteligente para creación de documentos académicos con
                  estructuración automatizada y personalización avanzada.
                </p>
              </SlideUpAnimation>

              <SlideUpAnimation delay={400}>
                <div className="flex justify-center gap-6 mt-8">
                  <Link to="/configuracion">
                    <Button className="h-14 px-12 bg-white text-primary hover:bg-white/90 text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-0.5">
                      Iniciar Proyecto
                      <span className="ml-2 opacity-90">→</span>
                    </Button>
                  </Link>
                </div>
              </SlideUpAnimation>
            </div>
          </section>

          {/* Features Grid */}
          <section className="w-full px-4 sm:px-6 mb-24">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <SlideUpAnimation key={index} delay={500 + index * 100}>
                  <Card className="relative overflow-hidden border-0 bg-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all group isolate">
                    <div className="absolute inset-0 border-t-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="items-start p-6 pb-0 space-y-4">
                      <div
                        className={`mb-4 ${feature.color} p-4 rounded-xl w-fit shadow-inner`}
                      >
                        {feature.icon}
                      </div>
                      <CardTitle className="text-2xl font-semibold text-white">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/80 pb-6 px-6">
                      <p className="leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </SlideUpAnimation>
              ))}
            </div>
          </section>

          {/* Workflow Section */}
          <section className="w-full px-4 sm:px-6 mb-24">
            <SlideUpAnimation delay={900}>
              <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16 text-white [text-wrap:balance]">
                  Proceso de Generación Estructurada
                </h2>

                <div className="relative space-y-12">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white/20 via-white/40 to-white/20 hidden md:block" />

                  {[
                    {
                      title: "Configuración Inicial",
                      content:
                        "Selección de tipo de documento y formato académico requerido",
                      icon: <FileText className="h-6 w-6 text-white" />,
                    },
                    {
                      title: "Personalización",
                      content:
                        "Edición de estructura e índice según necesidades específicas",
                      icon: <ClipboardList className="h-6 w-6 text-white" />,
                    },
                    {
                      title: "Validación",
                      content:
                        "Revisión de parámetros y confirmación de requisitos",
                      icon: <BadgeCheck className="h-6 w-6 text-white" />,
                    },
                    {
                      title: "Entrega",
                      content:
                        "Descarga del documento final en formato editable",
                      icon: <Send className="h-6 w-6 text-white" />,
                    },
                  ].map((step, index) => (
                    <SlideUpAnimation key={index} delay={1000 + index * 150}>
                      <div className="relative flex items-start gap-8 group">
                        <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white/30 ring-offset-2 ring-offset-transparent">
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-white mb-2">
                            {step.title}
                          </h3>
                          <p className="text-lg text-white/80 leading-relaxed [text-wrap:balance]">
                            {step.content}
                          </p>
                        </div>
                      </div>
                    </SlideUpAnimation>
                  ))}
                </div>
              </div>
            </SlideUpAnimation>
          </section>

          {/* Preview Section */}
          <section className="w-full px-4 sm:px-6 mb-24">
            <SlideUpAnimation delay={1600}>
              <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <h3 className="text-xl font-semibold text-white">
                    Vista Previa del Documento
                  </h3>
                  <p className="text-sm text-white/70">
                    Ejemplo de estructura académica estándar
                  </p>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="h-3 bg-white/20 rounded-full w-full animate-pulse" />
                    <div className="h-3 bg-white/20 rounded-full w-3/4 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 bg-yellow-50/10 p-4 rounded-lg border border-yellow-100/30">
                      <div className="space-y-3">
                        <div className="h-2.5 bg-yellow-100/30 rounded-full" />
                        <div className="h-2.5 bg-yellow-100/30 rounded-full w-5/6" />
                        <div className="h-2.5 bg-yellow-100/30 rounded-full w-4/6" />
                      </div>
                    </div>
                    <div className="col-span-2 space-y-3">
                      <div className="h-2.5 bg-white/20 rounded-full" />
                      <div className="h-2.5 bg-white/20 rounded-full w-11/12" />
                      <div className="h-2.5 bg-white/20 rounded-full w-10/12" />
                      <div className="h-2.5 bg-white/20 rounded-full w-9/12" />
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <div className="text-sm font-medium text-primary">
                      Referencias Bibliográficas
                    </div>
                    <div className="mt-2 h-2.5 bg-white/20 rounded-full w-1/2 animate-pulse" />
                  </div>
                </div>
              </div>
            </SlideUpAnimation>
          </section>

          {/* Final CTA */}
          <section className="w-full px-4 sm:px-6">
            <SlideUpAnimation delay={1800}>
              <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:3rem_3rem]" />
                <h2 className="text-4xl font-bold text-white mb-6 relative [text-wrap:balance]">
                  Optimiza tu Producción Académica
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto relative">
                  Tecnología avanzada para resultados precisos
                </p>
                <Link to="/configuracion">
                  <Button className="h-14 px-16 bg-white text-primary hover:bg-white/90 text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-0.5 relative">
                    Generar Documento
                  </Button>
                </Link>
                <p className="text-sm text-white/60 mt-6 relative">
                  Soporte técnico especializado • Garantía de cumplimiento
                  normativo
                </p>
              </div>
            </SlideUpAnimation>
          </section>
        </main>
      </div>
    </AnimatedBackground>
  );
}

export default HomePage;
