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
  Home,
} from "lucide-react";
import RainbowBackground from "./RainbowBackground";
import { useEffect } from "react";

export default function Confirmation() {
  const { state } = useLocation();
  const { formData } = state;

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

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="bg-gradient-to-r from-blue-500/20 to-blue-400/10 p-1.5 rounded">
                      <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="font-medium">
                      {formData.documentType} - {formData.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="bg-gradient-to-r from-purple-500/20 to-purple-400/10 p-1.5 rounded">
                      <Calendar className="w-5 h-5 text-purple-500" />
                    </div>
                    <span>Formato: <span className="font-medium">{formData.citationFormat}</span></span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="bg-gradient-to-r from-green-500/20 to-green-400/10 p-1.5 rounded">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <span>
                      WhatsApp: <span className="font-medium">{formData.countryCode} {formData.phoneNumber}</span>
                    </span>
                  </div>

                  {formData.coverData && formData.coverData.incluirCaratula && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                      <div className="bg-gradient-to-r from-orange-500/20 to-orange-400/10 p-1.5 rounded">
                        <BookOpen className="w-5 h-5 text-orange-500" />
                      </div>
                      <span>
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
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Te contactaremos por WhatsApp para coordinar los detalles y el pago. Revisa tu WhatsApp en los próximos minutos.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110" />
                  <Button asChild className="relative w-full h-12 text-lg rounded-xl bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground border-2 border-primary/50 hover:border-primary/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group"
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
          </CardContent>
        </Card>
      </div>
    </div>
    </RainbowBackground>
  );
}
