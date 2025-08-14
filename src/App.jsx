// src/App.jsx (con widget de WhatsApp y RainbowBackground)
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Suspense, lazy, memo } from "react";
import { DocumentProvider } from "./contexts/DocumentContext";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { FileText, Mail, Phone, MapPin } from "lucide-react";
import WhatsAppWidget from "./components/WhatsAppWidget";
import { LoadingSpinner } from "./components/LoadingSpinner";

// Lazy loading de componentes pesados
const AcademicForm = lazy(() => import("./components/AcademicForm"));
const HomePage = lazy(() => import("./components/HomePage"));
const IndexPreview = lazy(() => import("./components/IndexPreview"));
const Confirmation = lazy(() => import("./components/Confirmation"));
const GarantiaCalidad = lazy(() => import("./components/GarantiaCalidad"));
const PoliticaPrivacidad = lazy(() => import("./components/PoliticaPrivacidad"));
const TerminosServicio = lazy(() => import("./components/TerminosServicio"));

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <DocumentProvider>
          <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            {/* Header - Con posición fija y ancho total para evitar desplazamientos */}
            <header className="sticky top-0 z-50 w-full border-b border-border shadow-sm bg-background/95 backdrop-blur-md">
              <div className="w-full px-4 sm:px-6 mx-auto">
                <div className="flex items-center justify-between h-20 max-w-7xl mx-auto">
                  <Link to="/" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      RedactorIA
                    </span>
                  </Link>
                  <nav className="hidden md:flex items-center space-x-8">
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
                    <div className="flex items-center ml-4">
                      <ThemeToggle />
                    </div>
                  </nav>
                  <div className="flex items-center gap-4">
                    <Link to="/configuracion" className="hidden md:block">
                      <div className="relative w-36 h-11 transition-all duration-700 hover:duration-500 group"
                           style={{
                             transformStyle: 'preserve-3d',
                             transform: 'perspective(1000px) rotateY(0deg)'
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.transform = 'perspective(1000px) rotateY(-180deg)'
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg)'
                           }}>
                        {/* Cara frontal */}
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary text-primary-foreground rounded-xl shadow-lg transition-all duration-300"
                             style={{
                               transform: 'rotateY(0deg) translateZ(20px)',
                               backfaceVisibility: 'hidden'
                             }}>
                          <span className="font-medium text-sm">Empezar Ahora</span>
                        </div>
                        
                        {/* Cara trasera */}
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground rounded-xl shadow-lg transition-all duration-300"
                             style={{
                               transform: 'rotateY(180deg) translateZ(20px)',
                               backfaceVisibility: 'hidden'
                             }}>
                          <span className="font-medium text-sm">¡Vamos! 🎯</span>
                        </div>
                      </div>
                    </Link>
                    <div className="md:hidden flex items-center">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 w-full bg-background text-foreground">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/configuracion" element={<AcademicForm />} />
                  <Route path="/preview" element={<IndexPreview />} />
                  <Route path="/confirmacion" element={<Confirmation />} />
                  <Route path="/garantia-calidad" element={<GarantiaCalidad />} />
                  <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                  <Route path="/terminos-servicio" element={<TerminosServicio />} />
                </Routes>
              </Suspense>
            </main>

            {/* Footer con efecto blur - Optimizado para CLS */}
            <footer className="relative border-t border-border bg-background/80 backdrop-blur-lg" style={{ minHeight: '400px' }}>
              {/* Gradiente sutil en la parte superior */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Información de la empresa */}
                <div className="mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-2xl font-bold text-primary">
                      RedactorIA
                    </span>
                  </div>
                </div>

                {/* Enlaces en una sola fila */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Servicios */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Servicios</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/configuracion" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          Monografías Académicas
                        </Link>
                      </li>
                      <li>
                        <Link to="/configuracion" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          Ensayos Argumentativos
                        </Link>
                      </li>
                      <li>
                        <Link to="/configuracion" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          Informes Técnicos
                        </Link>
                      </li>
                      <li>
                        <span className="text-muted-foreground/60 text-sm">
                          Tesis (Próximamente)
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Legal */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Legal</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link to="/garantia-calidad" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          Garantía de Calidad
                        </Link>
                      </li>
                      <li>
                        <Link to="/politica-privacidad" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          Política de Privacidad
                        </Link>
                      </li>
                      <li>
                        <Link to="/terminos-servicio" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                          Términos de Servicio
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Contacto */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>WhatsApp: +51 961484114</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>asdw12365@gmail.com</span>
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Lima, Perú</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Separador con gradiente */}
                <div className="mt-12 pt-8 border-t border-border/50">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
                    {/* Copyright - Izquierda */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>© 2024 RedactorIA.</span>
                    </div>
                    
                    {/* Design Credit - Centro */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Design and Developed by</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200 cursor-default select-none"
                            style={{
                              fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", sans-serif',
                              fontWeight: '500',
                              letterSpacing: '0.025em'
                            }}>
                        Luxor
                      </span>
                    </div>

                    {/* Enlaces legales - Derecha */}
                    <div className="flex items-center gap-6">
                      <Link to="/politica-privacidad" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        Política de Privacidad
                      </Link>
                      <Link to="/terminos-servicio" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        Términos de Servicio
                      </Link>
                      <Link to="/garantia-calidad" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                        Garantía de Calidad
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Efecto de blur en los bordes */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background/0 to-background/5"></div>
              </div>
            </footer>

            {/* Widget de chat de WhatsApp - Visible en todas las páginas */}
            <WhatsAppWidget />

            <Toaster />
          </div>
        </DocumentProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
