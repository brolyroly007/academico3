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

// Importar el componente ScrollAwareHeader
import ScrollAwareHeader from "./components/ScrollAwareHeader";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <RouteProvider>
          <DocumentProvider>
            <div className="min-h-screen flex flex-col">
              {/* Header que se adapta al scroll y a la página */}
              <ScrollAwareHeader />

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
