// src/components/ScrollAwareHeader.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useRoute } from "../contexts/RouteContext";

const ScrollAwareHeader = () => {
  const [scrollY, setScrollY] = useState(0);
  const { isHomePage } = useRoute();
  const location = useLocation();

  // Detectar cuando el scroll es cercano a la parte superior
  const isAtTop = scrollY < 20;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isHomePage
          ? isAtTop
            ? "bg-transparent border-transparent"
            : "bg-black/30 backdrop-blur-xl border-b border-white/10"
          : "bg-background/95 backdrop-blur-md border-b border-primary/10"
      } shadow-lg w-full`}
    >
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className={`w-10 h-10 ${
                isHomePage
                  ? isAtTop
                    ? "bg-white/10"
                    : "bg-white/20 backdrop-blur-md"
                  : "bg-primary"
              } rounded-xl flex items-center justify-center transition-all ${
                isHomePage
                  ? "group-hover:bg-white/30"
                  : "group-hover:bg-primary/90"
              }`}
            >
              <FileText
                className={`h-6 w-6 ${
                  isHomePage ? "text-white" : "text-primary-foreground"
                }`}
              />
            </div>
            <span
              className={`text-2xl font-bold ${
                isHomePage
                  ? isAtTop
                    ? "text-white/90"
                    : "text-white"
                  : "text-primary"
              } transition-colors`}
            >
              RedactorIA
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            <Link
              to="/"
              className={`${
                isHomePage
                  ? isAtTop
                    ? "text-white/80"
                    : "text-white/90"
                  : "text-muted-foreground"
              } hover:text-white transition-colors font-medium ${
                location.pathname === "/" ? "font-bold" : ""
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/configuracion"
              className={`${
                isHomePage
                  ? isAtTop
                    ? "text-white/80"
                    : "text-white/90"
                  : "text-muted-foreground"
              } hover:text-white transition-colors font-medium ${
                location.pathname === "/configuracion" ? "font-bold" : ""
              }`}
            >
              Configurar
            </Link>
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/configuracion" className="hidden md:block">
              <Button
                className={`h-11 px-6 ${
                  isHomePage
                    ? "bg-white hover:bg-white/90 text-primary"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                } shadow-lg rounded-xl transition-all hover:-translate-y-0.5`}
              >
                Empezar Ahora
              </Button>
            </Link>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ScrollAwareHeader;
