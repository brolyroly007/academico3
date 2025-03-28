// src/components/HomePage.jsx (Con colores corregidos para modo oscuro)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Zap,
  LayoutTemplate,
  ClipboardList,
  Send,
  BadgeCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useTheme } from "./theme-provider";

export function HomePage() {
  const ctaSectionRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Generación Express",
      description: "Entrega inmediata con confirmación por WhatsApp",
      color: isDark
        ? "bg-yellow-900/30 text-yellow-200"
        : "bg-blue-100 text-blue-600",
    },
    {
      icon: <LayoutTemplate className="h-6 w-6" />,
      title: "Plantillas Académicas",
      description: "Estructuras predefinidas para diferentes formatos",
      color: isDark
        ? "bg-blue-900/30 text-blue-200"
        : "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Edición Flexible",
      description: "Personaliza índice y estructura previa a generación",
      color: isDark
        ? "bg-yellow-900/30 text-yellow-200"
        : "bg-blue-100 text-blue-600",
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Cumplimiento Normativo",
      description: "Formatos APA, Vancouver, MLA y Chicago",
      color: isDark
        ? "bg-blue-900/30 text-blue-200"
        : "bg-yellow-100 text-yellow-600",
    },
  ];

  // Configurar observador de intersección para animaciones al cargar el componente
  useEffect(() => {
    // Añadir clase para detectar si JavaScript está habilitado
    document.documentElement.classList.remove("no-js");

    // Trigger inicial de animaciones visibles en la carga
    setTimeout(() => {
      const initialElements = document.querySelectorAll(
        ".animate-on-scroll-initial"
      );
      initialElements.forEach((el) => {
        el.classList.add("animate-active");
      });
    }, 100); // Pequeño retraso para asegurar que el DOM está listo

    // Comprobamos si el navegador soporta IntersectionObserver
    if ("IntersectionObserver" in window) {
      const animateItems = document.querySelectorAll(
        ".animate-on-scroll:not(.animate-on-scroll-initial)"
      );

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Si el elemento es visible
            if (entry.isIntersecting) {
              // Añadir clase para iniciar animación
              entry.target.classList.add("animate-active");
              // Dejar de observar una vez animado
              observer.unobserve(entry.target);
            }
          });
        },
        {
          // Configuración del observador (umbral reducido para activación más temprana)
          threshold: 0.05,
          rootMargin: "0px 0px -10% 0px", // Activar antes de que el elemento esté completamente visible
        }
      );

      // Observar todos los elementos con la clase animate-on-scroll
      animateItems.forEach((item) => {
        observer.observe(item);
      });

      return () => {
        // Limpieza al desmontar el componente
        animateItems.forEach((item) => {
          observer.unobserve(item);
        });
      };
    }
  }, []);

  // Efecto específico para corregir la sección CTA
  useEffect(() => {
    if (ctaSectionRef.current) {
      // Asegurarse de que la sección CTA siempre se muestre correctamente
      setTimeout(() => {
        if (ctaSectionRef.current) {
          ctaSectionRef.current.style.opacity = "1";
          ctaSectionRef.current.style.clipPath = "inset(0 0 0 0)";
          ctaSectionRef.current.style.transform = "none";
          ctaSectionRef.current.classList.add("animate-active", "cta-section");
        }
      }, 1000);
    }
  }, [ctaSectionRef]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 w-full px-6 py-8 md:py-16">
        {/* Hero Section - Animación inmediata al cargar */}
        <section className="text-center mb-16 md:mb-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="animate-on-scroll animate-on-scroll-initial blur-in delay-0">
              <div className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-shadow">
                <Send className="h-4 w-4 mr-2" />
                Generación académica automatizada
              </div>
            </div>

            <div className="animate-on-scroll animate-on-scroll-initial fade-up delay-200">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground leading-tight [text-wrap:balance]">
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Precisión Automatizada
                </span>
                <br />
                en Redacción Académica
              </h1>
            </div>

            <div className="animate-on-scroll animate-on-scroll-initial fade-up delay-300">
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed [text-wrap:balance]">
                Sistema inteligente para creación de documentos académicos con
                estructuración automatizada y personalización avanzada.
              </p>
            </div>

            <div className="animate-on-scroll animate-on-scroll-initial rise-up delay-400">
              <div className="flex justify-center gap-6 mt-8">
                <Link to="/configuracion">
                  <Button className="h-14 px-12 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-0.5">
                    Iniciar Proyecto
                    <span className="ml-2 opacity-90">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full px-4 sm:px-6 mb-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl transition-all group isolate animate-on-scroll clip-reveal delay-${
                  index * 100
                }`}
              >
                <div className="absolute inset-0 border-t-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="items-start p-6 pb-0 space-y-4">
                  <div
                    className={`mb-4 ${feature.color} p-4 rounded-xl w-fit shadow-inner`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-semibold text-card-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground pb-6 px-6">
                  <p className="leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="w-full px-4 sm:px-6 mb-24">
          <div className="max-w-5xl mx-auto">
            <div className="animate-on-scroll scale-in">
              <h2 className="text-4xl font-bold text-center mb-16 text-foreground [text-wrap:balance]">
                Proceso de Generación Estructurada
              </h2>
            </div>

            <div className="relative space-y-12">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10 hidden md:block" />

              {[
                {
                  title: "Configuración Inicial",
                  content:
                    "Selección de tipo de documento y formato académico requerido",
                  icon: (
                    <FileText className="h-6 w-6 text-primary-foreground" />
                  ),
                },
                {
                  title: "Personalización",
                  content:
                    "Edición de estructura e índice según necesidades específicas",
                  icon: (
                    <ClipboardList className="h-6 w-6 text-primary-foreground" />
                  ),
                },
                {
                  title: "Validación",
                  content:
                    "Revisión de parámetros y confirmación de requisitos",
                  icon: (
                    <BadgeCheck className="h-6 w-6 text-primary-foreground" />
                  ),
                },
                {
                  title: "Entrega",
                  content: "Descarga del documento final en formato editable",
                  icon: <Send className="h-6 w-6 text-primary-foreground" />,
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative flex items-start gap-8 group animate-on-scroll slide-right delay-200"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-xl ring-2 ring-background ring-offset-2">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-card-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed [text-wrap:balance]">
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="w-full px-4 sm:px-6 mb-24">
          <div className="max-w-6xl mx-auto bg-card border border-border rounded-3xl shadow-xl overflow-hidden animate-on-scroll scale-in">
            <div className="p-6 border-b border-border bg-accent">
              <h3 className="text-xl font-semibold text-card-foreground">
                Vista Previa del Documento
              </h3>
              <p className="text-sm text-muted-foreground">
                Ejemplo de estructura académica estándar
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="h-3 bg-muted rounded-full w-full animate-pulse" />
                <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-1 bg-secondary/10 p-4 rounded-lg border border-secondary/20">
                  <div className="space-y-3">
                    <div className="h-2.5 bg-secondary/30 rounded-full" />
                    <div className="h-2.5 bg-secondary/30 rounded-full w-5/6" />
                    <div className="h-2.5 bg-secondary/30 rounded-full w-4/6" />
                  </div>
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="h-2.5 bg-muted rounded-full" />
                  <div className="h-2.5 bg-muted rounded-full w-11/12" />
                  <div className="h-2.5 bg-muted rounded-full w-10/12" />
                  <div className="h-2.5 bg-muted rounded-full w-9/12" />
                </div>
              </div>
              <div className="border-t border-border pt-6">
                <div className="text-sm font-medium text-primary">
                  Referencias Bibliográficas
                </div>
                <div className="mt-2 h-2.5 bg-muted rounded-full w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Con corrección específica para visibilidad completa */}
        <section className="w-full px-4 sm:px-6 overflow-visible">
          <div
            ref={ctaSectionRef}
            className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-12 text-center shadow-2xl relative overflow-visible animate-on-scroll clip-reveal cta-container"
            style={{
              width: "100%",
              opacity: 1,
              clipPath: "inset(0 0 0 0)",
            }}
          >
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:3rem_3rem]" />
            <h2 className="text-4xl font-bold text-primary-foreground mb-6 relative [text-wrap:balance]">
              Optimiza tu Producción Académica
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto relative">
              Tecnología avanzada para resultados precisos
            </p>
            <Link to="/configuracion">
              <Button className="h-14 px-16 bg-background text-primary text-lg rounded-xl shadow-2xl hover:bg-background/90 hover:shadow-3xl transition-all relative">
                Generar Documento
              </Button>
            </Link>
            <p className="text-sm text-primary-foreground/60 mt-6 relative">
              Soporte técnico especializado • Garantía de cumplimiento normativo
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
