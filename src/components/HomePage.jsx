// src/components/HomePage.jsx (Vista previa con estructuras y tablas)
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
  Table,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Play,
  Edit,
  FileDown,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "./theme-provider";
import RainbowBackground from "./RainbowBackground";

export function HomePage() {
  const ctaSectionRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activePreview, setActivePreview] = useState("monografia");
  const [activeStructure, setActiveStructure] = useState("estandar");

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Entrega Inmediata",
      description: "Documento completo en 3-15 min, según cantidad de páginas solicitada",
      color: isDark
        ? "bg-yellow-900/30 text-yellow-200"
        : "bg-blue-100 text-blue-600",
    },
    {
      icon: <LayoutTemplate className="h-6 w-6" />,
      title: "3 Estructuras Disponibles",
      description: "Elige entre formato estándar, por capítulos o académico",
      color: isDark
        ? "bg-blue-900/30 text-blue-200"
        : "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Personalización Total",
      description: "Ajusta el índice y contenido a tus necesidades exactas",
      color: isDark
        ? "bg-yellow-900/30 text-yellow-200"
        : "bg-blue-100 text-blue-600",
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: "Normativas APA 7",
      description: "Citas, referencias y formato según estándares académicos",
      color: isDark
        ? "bg-blue-900/30 text-blue-200"
        : "bg-yellow-100 text-yellow-600",
    },
  ];

  // Estructuras para monografías
  const monographStructures = {
    estandar: {
      title: "Estructura Estándar",
      description:
        "Organización tradicional con introducción, desarrollo y conclusiones",
      icon: <FileText className="h-5 w-5" />,
      structure: [
        { level: 1, text: "ÍNDICE", indent: 0, bold: true },
        { level: 1, text: "1. INTRODUCCIÓN", indent: 0, bold: true },
        { level: 2, text: "1.1 Contextualización", indent: 1 },
        { level: 2, text: "1.2 Objetivos", indent: 1 },
        { level: 2, text: "1.3 Justificación", indent: 1 },
        { level: 1, text: "2. DESARROLLO", indent: 0, bold: true },
        { level: 2, text: "2.1 Subtema principal", indent: 1 },
        { level: 2, text: "2.2 Análisis detallado", indent: 1 },
        { level: 2, text: "2.3 Desarrollo extendido", indent: 1 },
        { level: 1, text: "3. CONCLUSIONES", indent: 0, bold: true },
        { level: 2, text: "3.1 Síntesis", indent: 1 },
        { level: 2, text: "3.2 Consideraciones finales", indent: 1 },
        {
          level: 1,
          text: "4. REFERENCIAS BIBLIOGRÁFICAS",
          indent: 0,
          bold: true,
        },
      ],
    },
    capitulos: {
      title: "Por Capítulos",
      description:
        "División en capítulos numerados con subsecciones detalladas",
      icon: <ListTree className="h-5 w-5" />,
      structure: [
        { level: 1, text: "ÍNDICE", indent: 0, bold: true },
        { level: 1, text: "CAPÍTULO I: INTRODUCCIÓN", indent: 0, bold: true },
        { level: 2, text: "1.1 Introducción al tema", indent: 1, bold: true },
        { level: 2, text: "1.2 Contexto histórico", indent: 1, bold: true },
        {
          level: 2,
          text: "1.3 Antecedentes relevantes",
          indent: 1,
          bold: true,
        },
        { level: 1, text: "CAPÍTULO II: DESARROLLO", indent: 0, bold: true },
        { level: 2, text: "2.1 Desarrollo conceptual", indent: 1, bold: true },
        { level: 2, text: "2.2 Análisis detallado", indent: 1, bold: true },
        {
          level: 2,
          text: "2.3 Profundización temática",
          indent: 1,
          bold: true,
        },
        { level: 1, text: "CAPÍTULO III: ANÁLISIS", indent: 0, bold: true },
        { level: 2, text: "3.1 Análisis de resultados", indent: 1, bold: true },
        { level: 2, text: "3.2 Discusión de hallazgos", indent: 1, bold: true },
        {
          level: 2,
          text: "3.3 Interpretación extendida",
          indent: 1,
          bold: true,
        },
        { level: 1, text: "CAPÍTULO IV: CONCLUSIONES", indent: 0, bold: true },
        { level: 2, text: "4.1 Conclusiones", indent: 1, bold: true },
        { level: 2, text: "4.2 Recomendaciones", indent: 1, bold: true },
        { level: 2, text: "4.3 Perspectivas futuras", indent: 1, bold: true },
        { level: 1, text: "REFERENCIAS BIBLIOGRÁFICAS", indent: 0 },
      ],
    },
    academica: {
      title: "Estructura Académica",
      description:
        "Formato académico con objetivos, marco teórico y metodología",
      icon: <BookOpen className="h-5 w-5" />,
      structure: [
        { level: 1, text: "ÍNDICE", indent: 0, bold: true },
        { level: 1, text: "I. INTRODUCCIÓN", indent: 0, bold: true },
        { level: 2, text: "1.1 Planteamiento del problema", indent: 1 },
        { level: 2, text: "1.2 Justificación", indent: 1 },
        { level: 2, text: "1.3 Alcance del estudio", indent: 1 },
        { level: 1, text: "II. OBJETIVOS", indent: 0, bold: true },
        { level: 2, text: "2.1 Objetivo general", indent: 1 },
        { level: 2, text: "2.2 Objetivos específicos", indent: 1 },
        { level: 2, text: "2.3 Preguntas de investigación", indent: 1 },
        { level: 1, text: "III. MARCO TEÓRICO", indent: 0, bold: true },
        { level: 2, text: "3.1 Antecedentes", indent: 1 },
        { level: 2, text: "3.2 Bases teóricas", indent: 1 },
        { level: 2, text: "3.3 Estado del arte", indent: 1 },
        { level: 1, text: "IV. METODOLOGÍA", indent: 0, bold: true },
        { level: 2, text: "4.1 Tipo de investigación", indent: 1 },
        { level: 2, text: "4.2 Técnicas e instrumentos", indent: 1 },
        { level: 2, text: "4.3 Procedimientos metodológicos", indent: 1 },
        { level: 1, text: "V. RESULTADOS Y DISCUSIÓN", indent: 0, bold: true },
        { level: 2, text: "5.1 Presentación de resultados", indent: 1 },
        { level: 2, text: "5.2 Análisis de hallazgos", indent: 1 },
        { level: 2, text: "5.3 Discusión extendida", indent: 1 },
        { level: 1, text: "VI. CONCLUSIONES", indent: 0, bold: true },
        { level: 2, text: "6.1 Conclusiones", indent: 1 },
        { level: 2, text: "6.2 Recomendaciones", indent: 1 },
        { level: 2, text: "6.3 Líneas futuras de investigación", indent: 1 },
        {
          level: 1,
          text: "VII. REFERENCIAS BIBLIOGRÁFICAS",
          indent: 0,
          bold: true,
        },
      ],
    },
  };

  // Ejemplos sobre calentamiento global
  const documentPreviews = {
    monografia: {
      title: "MONOGRAFÍA",
      subtitle:
        "Impacto del Calentamiento Global en los Ecosistemas Terrestres: Análisis Integral 2020-2024",
      metadata: {
        author: "García Mendoza, Ana María",
        institution: "Universidad Nacional de Ciencias Ambientales",
        faculty: "Facultad de Ciencias Ambientales y Sostenibilidad",
        career: "Ingeniería Ambiental",
        course: "Cambio Climático y Sostenibilidad",
        professor: "Dr. Roberto Pérez Sánchez",
        date: "Diciembre 2024",
        pages: "45-50 páginas",
      },
      getCurrentStructure: () => monographStructures[activeStructure],
      sampleContent: {
        introduction: `El calentamiento global representa uno de los desafíos más apremiantes del siglo XXI, con implicaciones profundas para los sistemas naturales y humanos a escala planetaria. Según el Panel Intergubernamental sobre Cambio Climático (IPCC, 2023), la temperatura media global ha aumentado aproximadamente 1.1°C desde la era preindustrial, siendo este incremento atribuible inequívocamente a las actividades humanas.

La presente investigación monográfica examina exhaustivamente las múltiples dimensiones del calentamiento global, centrándose específicamente en su impacto sobre los ecosistemas terrestres. A través de un análisis sistemático de la literatura científica más reciente y datos empíricos recolectados entre 2020 y 2024, este trabajo busca proporcionar una comprensión integral del fenómeno.`,

        development: `Los ecosistemas terrestres enfrentan presiones sin precedentes debido al calentamiento global acelerado. La evidencia científica recopilada demuestra cambios significativos en los patrones de distribución de especies, alteraciones en los ciclos biogeoquímicos y modificaciones sustanciales en la productividad primaria de los ecosistemas.

Un análisis detallado de los datos satelitales de la NASA (2024) revela que la cobertura forestal global ha experimentado cambios dramáticos, con una pérdida neta de 10 millones de hectáreas anuales en regiones tropicales, mientras que las zonas boreales muestran una expansión hacia latitudes más altas, fenómeno conocido como "migración de biomas".`,

        table: {
          title:
            "Tabla 1. Impacto del Calentamiento Global en Ecosistemas Clave (2020-2024)",
          headers: [
            "Ecosistema",
            "Temperatura Δ°C",
            "Pérdida de Biodiversidad (%)",
            "Estado Actual",
          ],
          rows: [
            ["Bosques Tropicales", "+1.8", "23%", "Crítico"],
            ["Tundra Ártica", "+3.2", "18%", "Altamente Vulnerable"],
            ["Arrecifes de Coral", "+1.5", "45%", "En Colapso"],
            ["Bosques Templados", "+1.2", "12%", "Vulnerable"],
            ["Sabanas", "+1.6", "15%", "Moderadamente Afectado"],
          ],
        },

        graph: {
          title: "Figura 1. Tendencia de Temperatura Global y Emisiones de CO₂",
          description:
            "Correlación entre el aumento de temperatura y las emisiones acumuladas de CO₂ (1850-2024)",
          data: "Gráfico que muestra una correlación positiva del 0.95 entre emisiones y temperatura",
        },

        conclusions: `Los hallazgos de esta investigación confirman que el calentamiento global está generando transformaciones irreversibles en los ecosistemas terrestres. La velocidad actual del cambio climático supera la capacidad adaptativa de numerosas especies, resultando en extinciones locales y reorganizaciones ecológicas sin precedentes en la historia reciente.

Es imperativo implementar medidas de mitigación y adaptación inmediatas. Las proyecciones indican que sin acciones decisivas, el 30% de los ecosistemas terrestres experimentarán colapsos funcionales antes de 2050, con consecuencias catastróficas para los servicios ecosistémicos de los que depende la humanidad.`,
      },
      citations: [
        "IPCC. (2023). Climate Change 2023: Synthesis Report. Contribution of Working Groups I, II and III to the Sixth Assessment Report. Cambridge University Press. https://doi.org/10.1017/9781009325844",
        "NASA. (2024). Global Climate Change: Vital Signs of the Planet. National Aeronautics and Space Administration. Retrieved from https://climate.nasa.gov/vital-signs/",
        "Hansen, J., Sato, M., Ruedy, R., & Schmidt, G. (2023). Global temperature change and its uncertainties since 1850. Reviews of Geophysics, 61(3), e2023RG000766.",
        "Wilson, E. O., & Peters, F. M. (2024). Biodiversity loss in the Anthropocene. Annual Review of Ecology and Systematics, 55, 123-145.",
      ],
    },
    ensayo: {
      title: "ENSAYO ARGUMENTATIVO",
      subtitle:
        "La Paradoja del Conocimiento: Por Qué Sabemos Todo sobre el Cambio Climático pero Hacemos Tan Poco",
      metadata: {
        author: "Martínez López, Carlos Eduardo",
        institution: "Instituto Tecnológico de Estudios Superiores",
        career: "Licenciatura en Ciencias Ambientales",
        course: "Escritura Académica y Pensamiento Crítico",
        professor: "Dra. Laura Fernández Ruiz",
        date: "Noviembre 2024",
        pages: "20-25 páginas",
      },
      structure: [
        { level: 1, text: "ÍNDICE", indent: 0, bold: true },
        { level: 1, text: "I. INTRODUCCIÓN", indent: 0, bold: true },
        {
          level: 2,
          text: "1.1 La paradoja del conocimiento climático",
          indent: 1,
        },
        { level: 2, text: "1.2 Contexto de inacción global", indent: 1 },
        { level: 2, text: "1.3 Tesis central", indent: 1 },
        {
          level: 1,
          text: "II. DESARROLLO ARGUMENTATIVO",
          indent: 0,
          bold: true,
        },
        { level: 2, text: "2.1 El peso de la evidencia científica", indent: 1 },
        { level: 2, text: "2.2 Barreras psicológicas y sociales", indent: 1 },
        {
          level: 2,
          text: "2.3 Intereses económicos vs. supervivencia",
          indent: 1,
        },
        {
          level: 2,
          text: "2.4 Refutación de argumentos negacionistas",
          indent: 1,
        },
        { level: 1, text: "III. CONCLUSIÓN", indent: 0, bold: true },
        { level: 2, text: "3.1 Síntesis argumentativa", indent: 1 },
        { level: 2, text: "3.2 Llamado a la acción", indent: 1 },
        { level: 2, text: "3.3 Reflexión final", indent: 1 },
        {
          level: 1,
          text: "IV. REFERENCIAS BIBLIOGRÁFICAS",
          indent: 0,
          bold: true,
        },
      ],
      sampleContent: {
        introduction: `Vivimos en la era de la información, donde el conocimiento científico sobre el cambio climático es más robusto, accesible y convincente que nunca. Paradójicamente, mientras la evidencia se acumula y los científicos lanzan advertencias cada vez más urgentes, la acción colectiva permanece tristemente inadecuada. Esta paradoja —saber todo pero hacer poco— define nuestra respuesta contemporánea a la crisis climática.

Este ensayo argumenta que la brecha entre conocimiento y acción no es producto de la ignorancia, sino de una compleja red de factores psicológicos, económicos y políticos que paralizan nuestra capacidad de respuesta. La tesis central que defenderé es que superar esta parálisis requiere no más información, sino una transformación fundamental en cómo conceptualizamos nuestra relación con el futuro y con las generaciones venideras.`,

        argument: `La evidencia científica sobre el cambio climático es abrumadora e irrefutable. El consenso entre climatólogos activos supera el 99.9% (Lynas et al., 2023), una unanimidad sin precedentes en la ciencia moderna. Los datos son claros: las concentraciones de CO₂ han alcanzado 421 ppm, el nivel más alto en 3 millones de años; los últimos ocho años han sido los más cálidos registrados; el hielo ártico se reduce un 13% por década.

Sin embargo, esta montaña de evidencia se estrella contra barreras psicológicas profundamente arraigadas. El sesgo del presente nos hace valorar las recompensas inmediatas sobre los costos futuros. La distancia psicológica —temporal, geográfica y social— hace que el cambio climático se perciba como un problema abstracto y lejano. Como señala el psicólogo Daniel Kahneman (2023), "el cerebro humano simplemente no evolucionó para procesar amenazas graduales y a largo plazo".`,

        comparisonTable: {
          title: "Tabla 1. Conocimiento vs. Acción: La Brecha Climática",
          headers: ["Aspecto", "Lo que Sabemos", "Lo que Hacemos", "Brecha"],
          rows: [
            [
              "Emisiones necesarias",
              "Reducir 50% para 2030",
              "Aumento 1.5% anual",
              "Dirección opuesta",
            ],
            [
              "Energías renovables",
              "Tecnología disponible",
              "23% adopción global",
              "77% por implementar",
            ],
            [
              "Costo de inacción",
              "$1.7 trillones/año",
              "Inversión: $600 mil millones",
              "$1.1 trillones déficit",
            ],
            [
              "Consenso científico",
              "99.9% de acuerdo",
              "40% negacionismo público",
              "59.9% desconexión",
            ],
          ],
        },

        conclusion: `La paradoja del conocimiento climático revela una verdad incómoda: el problema no es la falta de información, sino la incapacidad de traducir ese conocimiento en acción significativa. Hemos documentado meticulosamente nuestra propia destrucción potencial mientras permanecemos atrapados en sistemas e inercias que perpetúan el problema.

Romper esta parálisis requiere más que datos adicionales o modelos más precisos. Necesitamos una revolución en nuestra psicología colectiva, una que nos permita sentir visceralmente las consecuencias futuras de nuestras acciones presentes. Como escribió el filósofo Timothy Morton, "el calentamiento global es un hiperobjeto: algo tan vasto en escala temporal y espacial que desafía la comprensión tradicional".

El tiempo para debates académicos ha terminado. Cada día de inacción es una elección activa de priorizar la comodidad presente sobre la supervivencia futura. La historia nos juzgará no por lo que sabíamos, sino por lo que hicimos con ese conocimiento. La pregunta que enfrentamos no es si podemos actuar —claramente podemos— sino si elegiremos hacerlo antes de que sea irreversiblemente tarde.`,
      },
      citations: [
        "Lynas, M., Houlton, B. Z., & Perry, S. (2023). Greater than 99% consensus on human caused climate change. Environmental Research Letters, 18(11), 114005.",
        "Kahneman, D. (2023). Thinking, Fast and Slow about Climate Change. Princeton University Press.",
        "Morton, T. (2023). Hyperobjects: Philosophy and Ecology after the End of the World (2nd ed.). University of Minnesota Press.",
        "UNEP. (2024). Emissions Gap Report 2024. United Nations Environment Programme. Nairobi.",
      ],
    },
  };

  // Configurar observador de intersección mejorado
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

      // Observador más sensible para mejor rendimiento
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Añadir delay para animaciones más suaves
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

      // Observar elementos con delay para evitar lag
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

  useEffect(() => {
    if (ctaSectionRef.current) {
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

  const currentPreview = documentPreviews[activePreview];

  return (
    <RainbowBackground>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 w-full px-6 py-8 md:py-16">
          {/* Hero Section */}
          <section className="text-center mb-16 md:mb-24 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="animate-on-scroll animate-on-scroll-initial blur-in delay-0">
                <div className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-shadow">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Documentos académicos con estructura
                  personalizable
                </div>
              </div>

              <div className="animate-on-scroll animate-on-scroll-initial fade-up delay-200">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground leading-tight [text-wrap:balance]">
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Redacción Académica
                  </span>
                  <br />
                  Completa y Estructurada
                </h1>
              </div>

              <div className="animate-on-scroll animate-on-scroll-initial fade-up delay-300">
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed [text-wrap:balance]">
                  Creamos documentos académicos completos con índice
                  personalizable, tablas, gráficos y referencias en formato APA
                  7
                </p>
              </div>

              <div className="animate-on-scroll animate-on-scroll-initial rise-up delay-400">
                <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
                  <Link to="/configuracion" className="inline-block">
                    <div className="relative w-72 h-16 transition-all duration-700 hover:duration-500 group cursor-pointer"
                         style={{
                           transformStyle: 'preserve-3d',
                           transform: 'perspective(1200px) rotateY(0deg)'
                         }}
                         onMouseEnter={(e) => {
                           e.currentTarget.style.transform = 'perspective(1200px) rotateY(-180deg) scale(1.05)'
                         }}
                         onMouseLeave={(e) => {
                           e.currentTarget.style.transform = 'perspective(1200px) rotateY(0deg) scale(1)'
                         }}>
                      
                      {/* Efecto de resplandor */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110" />
                      
                      {/* Cara frontal */}
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground text-lg rounded-xl shadow-2xl transition-all duration-500"
                           style={{
                             transform: 'rotateY(0deg) translateZ(30px)',
                             backfaceVisibility: 'hidden',
                             boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                           }}>
                        <span className="font-bold tracking-wide">Crear Mi Documento</span>
                        <span className="ml-3 opacity-90 text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </div>
                      
                      {/* Cara trasera */}
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-secondary via-secondary/90 to-secondary/80 text-secondary-foreground text-lg rounded-xl shadow-2xl transition-all duration-500"
                           style={{
                             transform: 'rotateY(180deg) translateZ(30px)',
                             backfaceVisibility: 'hidden',
                             boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                           }}>
                        <span className="font-bold tracking-wide">¡Empezar Proyecto!</span>
                        <span className="ml-3 text-xl animate-pulse">✨</span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg scale-110" />
                    <Button
                      className="relative h-16 px-10 text-lg rounded-xl bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground border-2 border-secondary/50 hover:border-secondary/80 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 group"
                      style={{
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                      }}
                      onClick={() =>
                        document
                          .getElementById("preview-section")
                          .scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      <Eye className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-bold tracking-wide">Ver Ejemplos</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="w-full px-4 sm:px-6 mb-24">
            <div className="max-w-7xl mx-auto">
              <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="feature-card animate-on-scroll clip-reveal"
                    style={{
                      animationDelay: `${index * 150}ms`,
                    }}
                  >
                    <span className="icon">
                      {feature.icon}
                    </span>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                    <div className="shine"></div>
                    <div className="background">
                      <div className="tiles">
                        <div className="tile tile-1"></div>
                        <div className="tile tile-2"></div>
                        <div className="tile tile-3"></div>
                        <div className="tile tile-4"></div>
                        <div className="tile tile-5"></div>
                        <div className="tile tile-6"></div>
                        <div className="tile tile-7"></div>
                        <div className="tile tile-8"></div>
                        <div className="tile tile-9"></div>
                        <div className="tile tile-10"></div>
                      </div>
                      <div className="line line-1"></div>
                      <div className="line line-2"></div>
                      <div className="line line-3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </section>

          {/* Vista Previa de Documentos */}
          <section id="preview-section" className="w-full px-4 sm:px-6 mb-24">
            <div className="max-w-7xl mx-auto">
              <div className="animate-on-scroll glow-fade text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4 [text-wrap:balance]">
                  Ejemplos de Documentos Académicos
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Documentos completos con índice estructurado, contenido
                  desarrollado, tablas y gráficos
                </p>
              </div>

              {/* Selector de tipo de documento */}
              <div className="animate-on-scroll fade-up mb-8">
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => {
                      setActivePreview("monografia");
                      setActiveStructure("estandar");
                    }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activePreview === "monografia"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <BookOpen className="h-5 w-5" />
                    Monografía
                  </button>
                  <button
                    onClick={() => setActivePreview("ensayo")}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      activePreview === "ensayo"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    Ensayo
                  </button>
                </div>

                {/* Selector de estructura para monografías */}
                {activePreview === "monografia" && (
                  <div className="flex justify-center gap-3 flex-wrap">
                    {Object.entries(monographStructures).map(
                      ([key, structure]) => (
                        <button
                          key={key}
                          onClick={() => setActiveStructure(key)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeStructure === key
                              ? "bg-secondary text-secondary-foreground shadow-md"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted/70"
                          }`}
                        >
                          {structure.icon}
                          {structure.title}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Contenido de la vista previa */}
              <div className="animate-on-scroll elastic-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Panel de estructura/índice */}
                  <div className="lg:col-span-1">
                    <Card className="h-full border border-border shadow-xl sticky top-24">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
                        <div className="flex items-center gap-2">
                          <ListTree className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">
                            {activePreview === "monografia"
                              ? monographStructures[activeStructure].title
                              : "Estructura del Ensayo"}
                          </CardTitle>
                        </div>
                        {activePreview === "monografia" && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {monographStructures[activeStructure].description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
                          {activePreview === "monografia"
                            ? monographStructures[
                                activeStructure
                              ].structure.map((item, index) => (
                                <div
                                  key={index}
                                  className={`text-sm transition-colors hover:bg-muted/50 p-2 rounded cursor-pointer ${
                                    item.bold ? "font-bold" : ""
                                  } ${
                                    item.level === 1
                                      ? "text-primary"
                                      : "text-foreground ml-4"
                                  }`}
                                  style={{
                                    paddingLeft: `${item.indent * 16 + 8}px`,
                                  }}
                                >
                                  {item.text}
                                </div>
                              ))
                            : currentPreview.structure.map((item, index) => (
                                <div
                                  key={index}
                                  className={`text-sm transition-colors hover:bg-muted/50 p-2 rounded cursor-pointer ${
                                    item.bold ? "font-bold" : ""
                                  } ${
                                    item.level === 1
                                      ? "text-primary"
                                      : "text-foreground ml-4"
                                  }`}
                                  style={{
                                    paddingLeft: `${item.indent * 16 + 8}px`,
                                  }}
                                >
                                  {item.text}
                                </div>
                              ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Panel de contenido */}
                  <div className="lg:col-span-2">
                    <Card className="h-full border border-border shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-secondary/10 to-primary/10 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-primary" />
                            <div>
                              <CardTitle className="text-lg">
                                {currentPreview.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {currentPreview.subtitle}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              DOCX
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6 max-h-[800px] overflow-y-auto scrollbar-thin">
                        {/* Portada del documento */}
                        <div className="text-center border-b pb-8 mb-8 page-break-after">
                          <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                              <Building className="h-16 w-16 text-primary/30" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                              {currentPreview.metadata.institution}
                            </h1>
                            {currentPreview.metadata.faculty && (
                              <h2 className="text-xl text-muted-foreground">
                                {currentPreview.metadata.faculty}
                              </h2>
                            )}
                            <h3 className="text-lg text-muted-foreground">
                              {currentPreview.metadata.career}
                            </h3>

                            <div className="my-8 py-4">
                              <h2 className="text-2xl font-bold text-foreground mb-4">
                                {currentPreview.title}
                              </h2>
                              <h3 className="text-xl italic text-foreground/90">
                                "{currentPreview.subtitle}"
                              </h3>
                            </div>

                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center justify-center gap-2">
                                <User className="h-4 w-4" />
                                <span>
                                  Autor:{" "}
                                  <strong>
                                    {currentPreview.metadata.author}
                                  </strong>
                                </span>
                              </div>
                              <p>
                                Docente: {currentPreview.metadata.professor}
                              </p>
                              <p>Curso: {currentPreview.metadata.course}</p>
                              <div className="flex items-center justify-center gap-2 mt-4">
                                <Calendar className="h-4 w-4" />
                                <span>{currentPreview.metadata.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Índice del documento */}
                        <div className="page-break-after mb-8">
                          <h2 className="text-2xl font-bold text-center text-foreground mb-6">
                            ÍNDICE
                          </h2>
                          <div className="space-y-2 max-w-2xl mx-auto">
                            {activePreview === "monografia"
                              ? monographStructures[activeStructure].structure
                                  .slice(1)
                                  .map((item, index) => (
                                    <div
                                      key={index}
                                      className={`flex justify-between items-center ${
                                        item.bold ? "font-bold" : ""
                                      } ${
                                        item.level === 1
                                          ? "text-base mt-3"
                                          : "text-sm"
                                      }`}
                                    >
                                      <span
                                        style={{
                                          paddingLeft: `${item.indent * 20}px`,
                                        }}
                                      >
                                        {item.text}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {item.level === 1 ? index + 1 : ""}
                                      </span>
                                    </div>
                                  ))
                              : currentPreview.structure
                                  .slice(1)
                                  .map((item, index) => (
                                    <div
                                      key={index}
                                      className={`flex justify-between items-center ${
                                        item.bold ? "font-bold" : ""
                                      } ${
                                        item.level === 1
                                          ? "text-base mt-3"
                                          : "text-sm"
                                      }`}
                                    >
                                      <span
                                        style={{
                                          paddingLeft: `${item.indent * 20}px`,
                                        }}
                                      >
                                        {item.text}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {item.level === 1 ? index + 1 : ""}
                                      </span>
                                    </div>
                                  ))}
                          </div>
                        </div>

                        {/* Contenido del documento según tipo */}
                        {activePreview === "monografia" ? (
                          <div className="space-y-8">
                            {/* Introducción */}
                            <div className="space-y-4">
                              <h3 className="text-2xl font-bold text-foreground border-b pb-2">
                                1. INTRODUCCIÓN
                              </h3>
                              <div className="space-y-4 text-justify leading-relaxed">
                                {currentPreview.sampleContent.introduction
                                  .split("\n\n")
                                  .map((paragraph, idx) => (
                                    <p
                                      key={idx}
                                      className="text-foreground indent-8"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </div>
                            </div>

                            {/* Desarrollo con Tabla */}
                            <div className="space-y-4">
                              <h3 className="text-2xl font-bold text-foreground border-b pb-2">
                                2. DESARROLLO
                              </h3>
                              <div className="space-y-4 text-justify leading-relaxed">
                                {currentPreview.sampleContent.development
                                  .split("\n\n")
                                  .map((paragraph, idx) => (
                                    <p
                                      key={idx}
                                      className="text-foreground indent-8"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </div>

                              {/* Tabla de datos */}
                              <div className="my-8">
                                <p className="text-center text-sm font-semibold mb-3">
                                  {currentPreview.sampleContent.table.title}
                                </p>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                                    <thead>
                                      <tr className="bg-gray-100 dark:bg-gray-800">
                                        {currentPreview.sampleContent.table.headers.map(
                                          (header, idx) => (
                                            <th
                                              key={idx}
                                              className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold"
                                            >
                                              {header}
                                            </th>
                                          )
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {currentPreview.sampleContent.table.rows.map(
                                        (row, rowIdx) => (
                                          <tr
                                            key={rowIdx}
                                            className={
                                              rowIdx % 2 === 0
                                                ? "bg-gray-50 dark:bg-gray-900/50"
                                                : ""
                                            }
                                          >
                                            {row.map((cell, cellIdx) => (
                                              <td
                                                key={cellIdx}
                                                className="border border-gray-300 dark:border-gray-600 px-4 py-2"
                                              >
                                                {cellIdx === 3 ? (
                                                  <span
                                                    className={`font-medium ${
                                                      cell === "Crítico" ||
                                                      cell === "En Colapso"
                                                        ? "text-red-600 dark:text-red-400"
                                                        : cell ===
                                                            "Altamente Vulnerable" ||
                                                          cell === "Vulnerable"
                                                        ? "text-orange-600 dark:text-orange-400"
                                                        : "text-yellow-600 dark:text-yellow-400"
                                                    }`}
                                                  >
                                                    {cell}
                                                  </span>
                                                ) : (
                                                  cell
                                                )}
                                              </td>
                                            ))}
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                                <p className="text-center text-xs text-muted-foreground mt-2">
                                  Fuente: Elaboración propia basada en datos del
                                  IPCC (2023) y NASA (2024)
                                </p>
                              </div>

                              {/* Gráfico simulado */}
                              <div className="my-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
                                <p className="text-center text-sm font-semibold mb-4">
                                  {currentPreview.sampleContent.graph.title}
                                </p>
                                <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded">
                                  <div className="text-center">
                                    <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                      {
                                        currentPreview.sampleContent.graph
                                          .description
                                      }
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {currentPreview.sampleContent.graph.data}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-center text-xs text-muted-foreground mt-2">
                                  Fuente: Base de datos climáticos globales
                                  (2024)
                                </p>
                              </div>
                            </div>

                            {/* Conclusiones */}
                            <div className="space-y-4">
                              <h3 className="text-2xl font-bold text-foreground border-b pb-2">
                                3. CONCLUSIONES
                              </h3>
                              <div className="space-y-4 text-justify leading-relaxed">
                                {currentPreview.sampleContent.conclusions
                                  .split("\n\n")
                                  .map((paragraph, idx) => (
                                    <p
                                      key={idx}
                                      className="text-foreground indent-8"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-8">
                            {/* Contenido del ensayo */}
                            <div className="space-y-4">
                              <h3 className="text-2xl font-bold text-foreground border-b pb-2">
                                I. INTRODUCCIÓN
                              </h3>
                              <div className="space-y-4 text-justify leading-relaxed">
                                {currentPreview.sampleContent.introduction
                                  .split("\n\n")
                                  .map((paragraph, idx) => (
                                    <p
                                      key={idx}
                                      className="text-foreground indent-8"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-2xl font-bold text-foreground border-b pb-2">
                                II. DESARROLLO ARGUMENTATIVO
                              </h3>
                              <div className="space-y-4 text-justify leading-relaxed">
                                {currentPreview.sampleContent.argument
                                  .split("\n\n")
                                  .map((paragraph, idx) => (
                                    <p
                                      key={idx}
                                      className="text-foreground indent-8"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </div>

                              {/* Tabla comparativa */}
                              <div className="my-8">
                                <p className="text-center text-sm font-semibold mb-3">
                                  {
                                    currentPreview.sampleContent.comparisonTable
                                      .title
                                  }
                                </p>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                                    <thead>
                                      <tr className="bg-gray-100 dark:bg-gray-800">
                                        {currentPreview.sampleContent.comparisonTable.headers.map(
                                          (header, idx) => (
                                            <th
                                              key={idx}
                                              className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold"
                                            >
                                              {header}
                                            </th>
                                          )
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {currentPreview.sampleContent.comparisonTable.rows.map(
                                        (row, rowIdx) => (
                                          <tr
                                            key={rowIdx}
                                            className={
                                              rowIdx % 2 === 0
                                                ? "bg-gray-50 dark:bg-gray-900/50"
                                                : ""
                                            }
                                          >
                                            {row.map((cell, cellIdx) => (
                                              <td
                                                key={cellIdx}
                                                className={`border border-gray-300 dark:border-gray-600 px-4 py-2 ${
                                                  cellIdx === 3
                                                    ? "font-medium text-orange-600 dark:text-orange-400"
                                                    : ""
                                                }`}
                                              >
                                                {cell}
                                              </td>
                                            ))}
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                                <p className="text-center text-xs text-muted-foreground mt-2">
                                  Fuente: Análisis comparativo de datos
                                  climáticos y respuestas políticas (2024)
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-2xl font-bold text-foreground border-b pb-2">
                                III. CONCLUSIÓN
                              </h3>
                              <div className="space-y-4 text-justify leading-relaxed">
                                {currentPreview.sampleContent.conclusion
                                  .split("\n\n")
                                  .map((paragraph, idx) => (
                                    <p
                                      key={idx}
                                      className="text-foreground indent-8"
                                    >
                                      {paragraph}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Sección de Referencias */}
                        <div className="mt-12 pt-8 border-t">
                          <h3 className="text-xl font-bold text-foreground mb-4">
                            REFERENCIAS BIBLIOGRÁFICAS (Formato APA 7ª Ed.)
                          </h3>
                          <div className="space-y-2">
                            {currentPreview.citations.map((citation, idx) => (
                              <div key={idx} className="pl-8 -indent-8">
                                <p className="text-sm text-foreground/90">
                                  {citation}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Características del documento */}
                        <div className="mt-8 pt-6 border-t">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="bg-primary/5 p-4 rounded-lg">
                              <div className="font-semibold text-primary text-lg">
                                {currentPreview.metadata.pages}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Documento completo
                              </div>
                            </div>
                            <div className="bg-secondary/5 p-4 rounded-lg">
                              <div className="font-semibold text-secondary text-lg flex items-center justify-center gap-2">
                                <Table className="h-5 w-5" />
                                Tablas y Gráficos
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Elementos visuales incluidos
                              </div>
                            </div>
                            <div className="bg-primary/5 p-4 rounded-lg">
                              <div className="font-semibold text-primary text-lg">
                                Formato APA 7
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Referencias actualizadas
                              </div>
                            </div>
                          </div>

                          {/* Nota informativa */}
                          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                                  Documento Completo Garantizado
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                  Recibirás el documento completo con todas las
                                  secciones desarrolladas, tablas de datos,
                                  gráficos relevantes, citas y referencias en
                                  formato APA 7.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Información adicional sobre estructuras */}
              {activePreview === "monografia" && (
                <div className="animate-on-scroll fade-up delay-200 mt-12">
                  <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">
                            3 Estructuras Disponibles para tu Monografía
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Puedes elegir la estructura que mejor se adapte a
                            los requisitos de tu institución:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(monographStructures).map(
                              ([key, structure]) => (
                                <div
                                  key={key}
                                  className="bg-background/60 rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    {structure.icon}
                                    <h5 className="font-medium text-sm">
                                      {structure.title}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {structure.description}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Botón de acción */}
              <div className="animate-on-scroll fade-up delay-200 text-center mt-24">
                <Link to="/configuracion" className="inline-block">
                  <div className="relative w-96 h-16 transition-all duration-800 hover:duration-600 group cursor-pointer"
                       style={{
                         transformStyle: 'preserve-3d',
                         transform: 'perspective(1200px) rotateY(0deg)'
                       }}
                       onMouseEnter={(e) => {
                         e.currentTarget.style.transform = 'perspective(1200px) rotateY(-180deg) scale(1.08) translateY(-4px)'
                       }}
                       onMouseLeave={(e) => {
                         e.currentTarget.style.transform = 'perspective(1200px) rotateY(0deg) scale(1) translateY(0px)'
                       }}>
                    
                    {/* Efecto de resplandor mejorado */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-600 blur-xl scale-125" />
                    
                    {/* Partículas flotantes */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-700">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} 
                             className="absolute w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse"
                             style={{
                               top: `${Math.random() * 100}%`,
                               left: `${Math.random() * 100}%`,
                               animationDelay: `${i * 0.2}s`,
                               animationDuration: '2s'
                             }} />
                      ))}
                    </div>
                    
                    {/* Cara frontal */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground text-xl rounded-xl shadow-2xl transition-all duration-600 overflow-hidden"
                         style={{
                           transform: 'rotateY(0deg) translateZ(35px)',
                           backfaceVisibility: 'hidden',
                           boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.1)'
                         }}>
                      {/* Brillo animado */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      <FileText className="h-7 w-7 mr-4 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500" />
                      <span className="font-bold tracking-wide">Crear Mi Documento Ahora</span>
                    </div>
                    
                    {/* Cara trasera */}
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/95 via-primary to-primary/95 text-primary-foreground text-xl rounded-xl shadow-2xl transition-all duration-600 overflow-hidden"
                         style={{
                           transform: 'rotateY(180deg) translateZ(35px)',
                           backfaceVisibility: 'hidden',
                           boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.1)'
                         }}>
                      {/* Brillo animado */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      <span className="mr-4 text-2xl animate-bounce">🚀</span>
                      <span className="font-bold tracking-wide">¡Empezar Mi Proyecto!</span>
                    </div>
                  </div>
                </Link>
                <p className="text-sm text-muted-foreground mt-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  Personaliza tu documento con la estructura que prefieras
                </p>
              </div>
            </div>
          </section>

          {/* Sección de Tutoriales */}
          <section className="w-full px-4 sm:px-6 mb-12">
            <div className="max-w-7xl mx-auto">
              <div className="animate-on-scroll bounce-in text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4 [text-wrap:balance]">
                  Tutoriales de Uso
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Aprende paso a paso cómo solicitar, modificar, descargar y editar tus trabajos académicos
                </p>
              </div>

              <div className="animate-on-scroll fade-up">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Tutorial: Cómo Solicitar */}
                  <Card className="relative overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <div className="absolute inset-0 border-t-2 border-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardHeader className="p-6 pb-4">
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl w-fit shadow-inner mb-4 transition-transform group-hover:scale-110">
                        <PlusCircle className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-card-foreground leading-tight mb-2">
                        Cómo Solicitar
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">
                        Proceso completo para crear tu solicitud de trabajo académico
                      </p>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 group/video cursor-pointer">
                        <div className="aspect-video flex items-center justify-center">
                          <div className="text-center">
                            <div className="bg-primary/20 rounded-full p-4 mb-2 mx-auto w-fit group-hover/video:bg-primary/30 transition-colors">
                              <Play className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">Ver tutorial completo</p>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          3:45
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Configuración inicial</li>
                        <li>• Selección de estructura</li>
                        <li>• Envío de información</li>
                        <li>• Confirmación de pedido</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Tutorial: Cómo Modificar */}
                  <Card className="relative overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <div className="absolute inset-0 border-t-2 border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardHeader className="p-6 pb-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl w-fit shadow-inner mb-4 transition-transform group-hover:scale-110">
                        <Edit className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-card-foreground leading-tight mb-2">
                        Cómo Modificar
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ajusta y personaliza tu trabajo antes de la entrega final
                      </p>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 group/video cursor-pointer">
                        <div className="aspect-video flex items-center justify-center">
                          <div className="text-center">
                            <div className="bg-primary/20 rounded-full p-4 mb-2 mx-auto w-fit group-hover/video:bg-primary/30 transition-colors">
                              <Play className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">Ver tutorial completo</p>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          2:30
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Revisión del contenido</li>
                        <li>• Solicitud de cambios</li>
                        <li>• Proceso de revisión</li>
                        <li>• Aprobación final</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Tutorial: Cómo Descargar */}
                  <Card className="relative overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <div className="absolute inset-0 border-t-2 border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardHeader className="p-6 pb-4">
                      <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-xl w-fit shadow-inner mb-4 transition-transform group-hover:scale-110">
                        <FileDown className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-card-foreground leading-tight mb-2">
                        Cómo Descargar
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">
                        Descarga tu trabajo en múltiples formatos disponibles
                      </p>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 group/video cursor-pointer">
                        <div className="aspect-video flex items-center justify-center">
                          <div className="text-center">
                            <div className="bg-primary/20 rounded-full p-4 mb-2 mx-auto w-fit group-hover/video:bg-primary/30 transition-colors">
                              <Play className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">Ver tutorial completo</p>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          1:45
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Acceso al documento</li>
                        <li>• Formatos disponibles</li>
                        <li>• Descarga segura</li>
                        <li>• Verificación de archivos</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Tutorial: Cómo Editar */}
                  <Card className="relative overflow-hidden border border-border bg-card shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <div className="absolute inset-0 border-t-2 border-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <CardHeader className="p-6 pb-4">
                      <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-3 rounded-xl w-fit shadow-inner mb-4 transition-transform group-hover:scale-110">
                        <FileText className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-card-foreground leading-tight mb-2">
                        Cómo Editar
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">
                        Guía para editar y personalizar tu trabajo entregado
                      </p>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 group/video cursor-pointer">
                        <div className="aspect-video flex items-center justify-center">
                          <div className="text-center">
                            <div className="bg-primary/20 rounded-full p-4 mb-2 mx-auto w-fit group-hover/video:bg-primary/30 transition-colors">
                              <Play className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">Ver tutorial completo</p>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                          4:20
                        </div>
                      </div>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Herramientas de edición</li>
                        <li>• Formato y estilo</li>
                        <li>• Revisión de contenido</li>
                        <li>• Guardado final</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

            </div>
          </section>

        </main>
      </div>
    </RainbowBackground>
  );
}

export default HomePage;
