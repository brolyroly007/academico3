// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { DocumentProvider } from "./contexts/DocumentContext";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import AcademicForm from "./components/AcademicForm";
import { HomePage } from "./components/HomePage";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import IndexPreview from "./components/IndexPreview";
import Confirmation from "./components/Confirmation";
import AnimatedBackground from "./components/AnimatedBackground";
import { RouteProvider, useRoute } from "./contexts/RouteContext";

// Componente Header adaptativo
function AdaptiveHeader() {
  const { isHomePage } = useRoute();
  const location = useLocation();

  return (
    <header
      className={`sticky top-0 z-50 ${
        isHomePage
          ? "bg-transparent backdrop-blur-xl border-b border-white/10"
          : "bg-background/95 backdrop-blur-md border-b border-primary/10"
      } shadow-lg w-full transition-colors duration-300`}
    >
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className={`w-10 h-10 ${
                isHomePage ? "bg-white/20 backdrop-blur-md" : "bg-primary"
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
                isHomePage ? "text-white" : "text-primary"
              }`}
            >
              RedactorIA
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              to="/"
              className={`${
                isHomePage
                  ? "text-white/80 hover:text-white"
                  : "text-muted-foreground hover:text-primary"
              } transition-colors font-medium ${
                location.pathname === "/" ? "font-bold" : ""
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/configuracion"
              className={`${
                isHomePage
                  ? "text-white/80 hover:text-white"
                  : "text-muted-foreground hover:text-primary"
              } transition-colors font-medium ${
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
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RouteProvider>
          <DocumentProvider>
            <div className="min-h-screen flex flex-col">
              {/* Header adaptativo que se ajusta según la página */}
              <AdaptiveHeader />

              <main className="flex-1 w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/configuracion"
                    element={
                      <div className="bg-background">
                        <AcademicForm />
                      </div>
                    }
                  />
                  <Route
                    path="/preview"
                    element={
                      <div className="bg-background">
                        <IndexPreview />
                      </div>
                    }
                  />
                  <Route
                    path="/confirmacion"
                    element={
                      <div className="bg-background">
                        <Confirmation />
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Toaster />
            </div>
          </DocumentProvider>
        </RouteProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
