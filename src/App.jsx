// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <DocumentProvider>
          <div className="min-h-screen flex flex-col">
            {/* Header Unificado */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/10 shadow-sm w-full">
              <div className="w-full px-4 sm:px-6">
                <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
                  <Link to="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      RedactorIA
                    </span>
                  </Link>
                  <nav className="hidden md:flex items-center space-x-10">
                    <Link
                      to="/"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Inicio
                    </Link>
                    <Link
                      to="/configuracion"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      Configurar
                    </Link>
                    <ThemeToggle />
                  </nav>
                  <div className="flex items-center gap-4">
                    <Link to="/configuracion" className="hidden md:block">
                      <Button className="h-11 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-xl">
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
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
