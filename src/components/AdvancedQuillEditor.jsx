import React, { useState, useRef, useEffect } from 'react';
import QuillEditor from './QuillEditor';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Save,
  Wand2,
  Plus,
  RefreshCw,
  Edit3,
  FileText,
  Table,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Settings,
  Download,
  Eye,
  BarChart3,
  MoreHorizontal,
  Zap
} from 'lucide-react';

const AdvancedQuillEditor = ({ initialContent, onSave, formData }) => {
  const [content, setContent] = useState(initialContent || '');
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [sectionActions, setSectionActions] = useState({});
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);

  // Detectar secciones en el contenido
  const extractSections = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    return Array.from(headings).map((heading, index) => ({
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent.trim(),
      id: `section-${index}`,
      element: heading
    }));
  };

  // Agregar event listeners para hover en secciones
  useEffect(() => {
    if (editorContainerRef.current && !isPreviewMode) {
      const editorElement = editorContainerRef.current.querySelector('.ql-editor');
      if (editorElement) {
        const headings = editorElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach((heading, index) => {
          // Limpiar listeners anteriores
          heading.removeEventListener('mouseenter', handleSectionHover);
          heading.removeEventListener('mouseleave', handleSectionLeave);
          
          // Agregar nuevos listeners
          heading.addEventListener('mouseenter', () => handleSectionHover(index, heading));
          heading.addEventListener('mouseleave', handleSectionLeave);
          
          // Añadir clase para identificar secciones
          heading.classList.add('section-hoverable');
          heading.style.position = 'relative';
          heading.style.cursor = 'pointer';
        });
      }
    }
  }, [content, isPreviewMode]);

  const handleSectionHover = (index, element) => {
    setHoveredSection(index);
    
    // Crear botón hover si no existe
    if (!element.querySelector('.section-hover-button')) {
      const button = document.createElement('div');
      button.className = 'section-hover-button';
      button.innerHTML = `
        <div class="flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium hover:bg-purple-700 transition-all duration-200 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
          </svg>
          Editar Sección
        </div>
      `;
      button.style.position = 'absolute';
      button.style.top = '-10px';
      button.style.right = '10px';
      button.style.zIndex = '1000';
      button.style.opacity = '0';
      button.style.transition = 'opacity 0.2s ease';
      
      // Event listener para el botón
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedSection(element.textContent.trim());
        setIsAIDialogOpen(true);
      });
      
      element.appendChild(button);
    }
    
    // Mostrar botón
    const button = element.querySelector('.section-hover-button');
    if (button) {
      button.style.opacity = '1';
    }
  };

  const handleSectionLeave = () => {
    setHoveredSection(null);
    
    // Ocultar todos los botones hover
    const buttons = document.querySelectorAll('.section-hover-button');
    buttons.forEach(button => {
      button.style.opacity = '0';
    });
  };

  const handleAIRegenerate = async (section) => {
    setIsProcessing(true);
    try {
      const prompt = section === 'todo' 
        ? `Regenera completamente el índice para un ${formData?.documentType || 'documento'} sobre "${formData?.topic || 'tema académico'}". ${aiInstructions}`
        : `Regenera la sección "${section}" del índice para un ${formData?.documentType || 'documento'} sobre "${formData?.topic || 'tema académico'}". Instrucciones adicionales: ${aiInstructions}`;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (section === 'todo') {
        const newFullContent = `
          <h1>ÍNDICE GENERAL</h1>
          <h2>I. INTRODUCCIÓN</h2>
          <p style="margin-left: 20px;">1.1 Planteamiento del problema</p>
          <p style="margin-left: 20px;">1.2 Justificación</p>
          <p style="margin-left: 20px;">1.3 Objetivos</p>
          <p style="margin-left: 40px;">1.3.1 Objetivo general</p>
          <p style="margin-left: 40px;">1.3.2 Objetivos específicos</p>
          
          <h2>II. MARCO TEÓRICO</h2>
          <p style="margin-left: 20px;">2.1 Antecedentes</p>
          <p style="margin-left: 20px;">2.2 Bases teóricas</p>
          <p style="margin-left: 20px;">2.3 Marco conceptual</p>
          
          <h2>III. METODOLOGÍA</h2>
          <p style="margin-left: 20px;">3.1 Tipo de investigación</p>
          <p style="margin-left: 20px;">3.2 Población y muestra</p>
          <p style="margin-left: 20px;">3.3 Técnicas e instrumentos</p>
          
          <h2>IV. RESULTADOS</h2>
          <p style="margin-left: 20px;">4.1 Presentación de resultados</p>
          <p style="margin-left: 20px;">4.2 Análisis e interpretación</p>
          
          <h2>V. CONCLUSIONES Y RECOMENDACIONES</h2>
          <p style="margin-left: 20px;">5.1 Conclusiones</p>
          <p style="margin-left: 20px;">5.2 Recomendaciones</p>
          
          <h2>VI. REFERENCIAS BIBLIOGRÁFICAS</h2>
          
          <h2>VII. ANEXOS</h2>
        `;
        setContent(newFullContent);
      } else {
        // Buscar la sección específica y reemplazarla
        const updatedContent = content.replace(
          new RegExp(`<h[1-6][^>]*>${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^<]*</h[1-6]>`, 'i'),
          `<h3>${section} (Regenerado con IA)</h3>`
        );
        
        setContent(updatedContent + `<p style="margin-left: 20px;"><em>Contenido actualizado para "${section}" basado en: ${aiInstructions || 'Indicaciones estándar'}</em></p>`);
      }
      
      setIsAIDialogOpen(false);
      setAiInstructions('');
    } catch (error) {
      console.error('Error al regenerar con IA:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const insertCustomElement = (type) => {
    if (!quillRef.current) return;
    
    let htmlContent = '';
    
    switch (type) {
      case 'info-box':
        htmlContent = `
          <div style="background-color: #e0f2fe; border-left: 4px solid #0284c7; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <p><strong>📘 Información importante:</strong></p>
            <p>Agregar contenido relevante aquí...</p>
          </div>
        `;
        break;
      case 'note-box':
        htmlContent = `
          <div style="background-color: #fefce8; border: 1px solid #eab308; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p><strong>📝 Nota:</strong></p>
            <p>Información adicional o aclaración...</p>
          </div>
        `;
        break;
      case 'warning-box':
        htmlContent = `
          <div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p><strong>⚠️ Importante:</strong></p>
            <p>Punto crítico a considerar...</p>
          </div>
        `;
        break;
      case 'tip-box':
        htmlContent = `
          <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p><strong>💡 Consejo:</strong></p>
            <p>Sugerencia útil para el lector...</p>
          </div>
        `;
        break;
      case 'simple-table':
        htmlContent = `
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Encabezado 1</th>
                <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Encabezado 2</th>
                <th style="border: 1px solid #e2e8f0; padding: 8px; text-align: left;">Encabezado 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 8px;">Celda 1</td>
                <td style="border: 1px solid #e2e8f0; padding: 8px;">Celda 2</td>
                <td style="border: 1px solid #e2e8f0; padding: 8px;">Celda 3</td>
              </tr>
            </tbody>
          </table>
        `;
        break;
    }
    
    quillRef.current.insertHTML(htmlContent);
  };

  const sections = extractSections(content);

  const getDocumentSummary = () => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    const sectionCount = sections.length;
    const documentType = formData?.documentType || 'Documento';
    const topic = formData?.topic || 'Sin título';
    
    return {
      title: topic,
      type: documentType,
      sections: sectionCount,
      words: wordCount,
      lastModified: new Date().toLocaleString('es-ES')
    };
  };

  const summary = getDocumentSummary();

  return (
    <div className="w-full space-y-4">
      {/* Resumen del documento - Full width */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Estadísticas del Documento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-3 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Título</p>
              <p className="font-semibold text-sm">{summary.title}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Tipo</p>
              <p className="font-semibold text-sm">{summary.type}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Secciones</p>
              <p className="font-semibold text-sm text-blue-600">{summary.sections}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Palabras</p>
              <p className="font-semibold text-sm text-green-600">{summary.words}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Páginas Est.</p>
              <p className="font-semibold text-sm text-purple-600">{formData?.length || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Curso</p>
              <p className="font-semibold text-sm truncate" title={formData?.course}>{formData?.course}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Área</p>
              <p className="font-semibold text-sm truncate" title={formData?.career}>{formData?.career}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-xs">Contacto</p>
              <p className="font-semibold text-sm">{formData?.countryCode} {formData?.phoneNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor principal - Full width */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Editor de Índice Avanzado
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Pasa el cursor sobre las secciones para editarlas)
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                variant="outline"
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? 'Editar' : 'Vista Previa'}
              </Button>
              <Button 
                onClick={() => onSave(content)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barra de herramientas superior - Full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
            {/* Herramientas de IA */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                IA
              </h4>
              <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-purple-600 hover:text-purple-700"
                    onClick={() => {
                      setSelectedSection('todo');
                      setIsAIDialogOpen(true);
                    }}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Rehacer Todo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5" />
                      {selectedSection === 'todo' ? 'Regenerar Índice Completo' : `Editar Sección: ${selectedSection}`}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Instrucciones para la IA:</label>
                      <Textarea
                        placeholder={selectedSection === 'todo' 
                          ? "Instrucciones adicionales para regenerar todo el índice (opcional)..."
                          : `Instrucciones específicas para mejorar la sección "${selectedSection}"...`
                        }
                        value={aiInstructions}
                        onChange={(e) => setAiInstructions(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAIRegenerate(selectedSection)}
                        disabled={isProcessing}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Regenerando...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            {selectedSection === 'todo' ? 'Regenerar Todo' : 'Regenerar Sección'}
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setIsAIDialogOpen(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Elementos personalizados */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Elementos</h4>
              <div className="grid grid-cols-2 gap-1">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertCustomElement('info-box')}
                  className="text-xs"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Info
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertCustomElement('note-box')}
                  className="text-xs"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Nota
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertCustomElement('warning-box')}
                  className="text-xs"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Alerta
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertCustomElement('tip-box')}
                  className="text-xs"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Consejo
                </Button>
              </div>
            </div>

            {/* Tablas */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Tablas</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => insertCustomElement('simple-table')}
                className="w-full"
              >
                <Table className="w-4 h-4 mr-2" />
                Insertar
              </Button>
            </div>

            {/* Información del documento */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Info</h4>
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Formato:</span> {formData?.citationFormat}</p>
                <p><span className="font-medium">Tono:</span> {formData?.essayTone}</p>
              </div>
            </div>

            {/* Secciones detectadas */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Secciones ({sections.length})</h4>
              <div className="max-h-16 overflow-y-auto space-y-1">
                {sections.slice(0, 4).map((section, index) => (
                  <div key={section.id} className="text-xs bg-muted/50 px-2 py-1 rounded flex items-center justify-between">
                    <span className="truncate">{section.text.substring(0, 15)}...</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        setSelectedSection(section.text);
                        setIsAIDialogOpen(true);
                      }}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {sections.length > 4 && (
                  <p className="text-xs text-muted-foreground">+{sections.length - 4} más</p>
                )}
              </div>
            </div>
          </div>

          {/* Editor principal */}
          <div ref={editorContainerRef} className="w-full">
            {isPreviewMode ? (
              <div 
                className="prose prose-sm max-w-none p-6 min-h-[600px] bg-white border rounded-lg"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <QuillEditor
                ref={quillRef}
                value={content}
                onChange={setContent}
                placeholder="Comience a escribir el índice de su documento..."
                className="min-h-[600px] w-full"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedQuillEditor;