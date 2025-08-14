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
  Play,
  Table,
  BarChart3,
  AlertCircle,
  Edit,
  FileDown,
  PlusCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { memo, useState, useRef } from "react";
import { useTheme } from "./theme-provider";

export const MobileOptimizedHomePage = memo(function MobileOptimizedHomePage() {
  const ctaSectionRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activePreview, setActivePreview] = useState("monografia");
  const [activeStructure, setActiveStructure] = useState("estandar");

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Entrega Inmediata",
      description: "Documento completo en 3-15 min, según cantidad de páginas",
      color: isDark ? "bg-yellow-900/30 text-yellow-200" : "bg-blue-100 text-blue-600",
    },
    {
      icon: <LayoutTemplate className="h-6 w-6" />,
      title: "3 Estructuras Disponibles", 
      description: "Elige entre formato estándar, por capítulos o académico",
      color: isDark ? "bg-blue-900/30 text-blue-200" : "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Personalización Total",
      description: "Ajusta el índice y contenido a tus necesidades exactas",
      color: isDark ? "bg-yellow-900/30 text-yellow-200" : "bg-blue-100 text-blue-600",
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Normativas APA 7",
      description: "Citas, referencias y formato según estándares académicos",
      color: isDark ? "bg-blue-900/30 text-blue-200" : "bg-yellow-100 text-yellow-600",
    },
  ];

  const scrollToCTA = () => {
    ctaSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPreview = () => {
    const element = document.getElementById('preview-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Simplified document structures
  const getDocumentStructure = () => {
    const structures = {
      monografia: {
        estandar: [
          { level: 1, text: "ÍNDICE", indent: 0, bold: true },
          { level: 1, text: "1. INTRODUCCIÓN", indent: 0, bold: true },
          { level: 2, text: "1.1 Contextualización", indent: 1 },
          { level: 2, text: "1.2 Objetivos", indent: 1 },
          { level: 1, text: "2. DESARROLLO", indent: 0, bold: true },
          { level: 2, text: "2.1 Subtema principal", indent: 1 },
          { level: 2, text: "2.2 Análisis detallado", indent: 1 },
          { level: 1, text: "3. CONCLUSIONES", indent: 0, bold: true },
          { level: 1, text: "4. REFERENCIAS", indent: 0, bold: true }
        ],
        capitulos: [
          { level: 1, text: "ÍNDICE", indent: 0, bold: true },
          { level: 1, text: "CAPÍTULO I: INTRODUCCIÓN", indent: 0, bold: true },
          { level: 2, text: "1.1 Introducción al tema", indent: 1 },
          { level: 2, text: "1.2 Contexto histórico", indent: 1 },
          { level: 1, text: "CAPÍTULO II: DESARROLLO", indent: 0, bold: true },
          { level: 1, text: "CAPÍTULO III: CONCLUSIONES", indent: 0, bold: true },
          { level: 1, text: "REFERENCIAS", indent: 0, bold: true }
        ],
        academica: [
          { level: 1, text: "ÍNDICE", indent: 0, bold: true },
          { level: 1, text: "I. INTRODUCCIÓN", indent: 0, bold: true },
          { level: 1, text: "II. OBJETIVOS", indent: 0, bold: true },
          { level: 1, text: "III. MARCO TEÓRICO", indent: 0, bold: true },
          { level: 1, text: "IV. METODOLOGÍA", indent: 0, bold: true },
          { level: 1, text: "V. RESULTADOS", indent: 0, bold: true },
          { level: 1, text: "VI. CONCLUSIONES", indent: 0, bold: true },
          { level: 1, text: "VII. REFERENCIAS", indent: 0, bold: true }
        ]
      },
      ensayo: [
        { level: 1, text: "ÍNDICE", indent: 0, bold: true },
        { level: 1, text: "I. INTRODUCCIÓN", indent: 0, bold: true },
        { level: 1, text: "II. DESARROLLO ARGUMENTATIVO", indent: 0, bold: true },
        { level: 1, text: "III. CONCLUSIÓN", indent: 0, bold: true },
        { level: 1, text: "IV. REFERENCIAS", indent: 0, bold: true }
      ]
    };

    if (activePreview === 'monografia') {
      return structures.monografia[activeStructure] || structures.monografia.estandar;
    }
    return structures.ensayo;
  };

  const getSampleContent = () => {
    const content = {
      monografia: {
        subtitle: "Impacto del Calentamiento Global en los Ecosistemas Terrestres: Análisis Integral 2020-2024",
        introduction: "El calentamiento global representa uno de los desafíos más apremiantes del siglo XXI, con implicaciones profundas para los sistemas naturales y humanos a escala planetaria."
      },
      ensayo: {
        subtitle: "La Paradoja del Conocimiento: Por Qué Sabemos Todo sobre el Cambio Climático pero Hacemos Tan Poco",
        introduction: "Vivimos en la era de la información, donde el conocimiento científico sobre el cambio climático es más robusto, accesible y convincente que nunca."
      }
    };
    return content[activePreview] || content.monografia;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-screen">
        <main className="w-full">
          {/* Hero Section */}
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
                Creamos documentos académicos completos con índice personalizable, 
                tablas, gráficos y referencias en formato APA 7
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link to="/configuracion">
                    <FileText className="mr-2 h-5 w-5" />
                    Crear Documento
                  </Link>
                </Button>
                <Button
                  onClick={scrollToPreview}
                  variant="outline"
                  size="lg"
                  className="border-border bg-background/50 backdrop-blur hover:bg-background/80 transition-all duration-200"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Ver Ejemplos
                </Button>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  ¿Por qué elegir nuestro generador?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-200 ${feature.color}`}
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

          {/* Process Steps */}
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
                    description: "Escoge entre estructura estándar, por capítulos o académica"
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

          {/* Document Preview Section */}
          <section id="preview-section" className="py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Ejemplos de Documentos Académicos
                </h2>
                <p className="text-lg text-muted-foreground">
                  Documentos completos con índice estructurado y contenido desarrollado
                </p>
              </div>

              {/* Document Type Selector */}
              <div className="flex justify-center gap-4 mb-8 flex-wrap">
                <button
                  onClick={() => {
                    setActivePreview("monografia");
                    setActiveStructure("estandar");
                  }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activePreview === "monografia"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Monografía
                </button>
                <button
                  onClick={() => setActivePreview("ensayo")}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activePreview === "ensayo"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  Ensayo
                </button>
              </div>

              {/* Structure Selector for Monographs */}
              {activePreview === "monografia" && (
                <div className="flex justify-center gap-2 flex-wrap mb-6">
                  {[
                    { key: "estandar", title: "Estándar", icon: <FileText className="h-4 w-4" /> },
                    { key: "capitulos", title: "Capítulos", icon: <ListTree className="h-4 w-4" /> },
                    { key: "academica", title: "Académica", icon: <BookOpen className="h-4 w-4" /> }
                  ].map((structure) => (
                    <button
                      key={structure.key}
                      onClick={() => setActiveStructure(structure.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeStructure === structure.key
                          ? "bg-secondary text-secondary-foreground shadow-sm"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      {structure.icon}
                      {structure.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Preview Content */}
              <div className="grid gap-6">
                {/* Document Structure */}
                <Card className="border border-border shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                    <div className="flex items-center gap-2">
                      <ListTree className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        {activePreview === "monografia" 
                          ? `Estructura ${activeStructure === "estandar" ? "Estándar" : activeStructure === "capitulos" ? "por Capítulos" : "Académica"}`
                          : "Estructura del Ensayo"
                        }
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {getDocumentStructure().map((item, index) => (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded transition-colors hover:bg-muted/50 ${
                            item.bold ? "font-bold" : ""
                          } ${
                            item.level === 1 ? "text-primary" : "text-foreground"
                          }`}
                          style={{ paddingLeft: `${item.indent * 16 + 8}px` }}
                        >
                          {item.text}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Content */}
                <Card className="border border-border shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10">
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          {activePreview === "monografia" ? "MONOGRAFÍA" : "ENSAYO ARGUMENTATIVO"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getSampleContent().subtitle}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {/* Introduction Sample */}
                    <div>
                      <h4 className="font-bold text-foreground mb-2">1. INTRODUCCIÓN</h4>
                      <p className="text-sm text-justify leading-relaxed text-foreground/90">
                        {getSampleContent().introduction}...
                      </p>
                    </div>

                    {/* Document Features */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="bg-primary/5 p-3 rounded-lg text-center">
                        <div className="font-semibold text-primary text-sm">
                          {activePreview === "monografia" ? "45-50" : "20-25"} pág.
                        </div>
                        <div className="text-xs text-muted-foreground">Completo</div>
                      </div>
                      <div className="bg-secondary/5 p-3 rounded-lg text-center">
                        <Table className="h-4 w-4 text-secondary mx-auto mb-1" />
                        <div className="text-xs text-muted-foreground">Tablas</div>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-lg text-center">
                        <div className="font-semibold text-primary text-sm">APA 7</div>
                        <div className="text-xs text-muted-foreground">Formato</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Button */}
              <div className="text-center mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link to="/configuracion">
                    <FileText className="mr-2 h-5 w-5" />
                    Crear Mi Documento Ahora
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Document Types */}
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
                  <Card key={index} className={`${docType.color} transition-all duration-200 hover:shadow-lg`}>
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

          {/* Benefits Section */}
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

          {/* CTA Section */}
          <section ref={ctaSectionRef} className="py-16 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border">
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
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
                    className="transition-all duration-200"
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
    </div>
  );
});

export default MobileOptimizedHomePage;