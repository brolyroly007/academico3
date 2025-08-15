import React, { useState, useRef } from 'react';
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
  BarChart3
} from 'lucide-react';

const FullQuillIndexEditor = ({ initialContent, onSave, formData }) => {
  const [content, setContent] = useState(initialContent || '');
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const quillRef = useRef(null);

  const extractSections = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    return Array.from(headings).map(heading => ({
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent.trim(),
      id: `section-${Math.random().toString(36).substr(2, 9)}`
    }));
  };

  const handleAIRegenerate = async (section) => {
    setIsProcessing(true);
    try {
      const prompt = section === 'todo' 
        ? `Regenera completamente el índice para un ${formData?.documentType || 'documento'} sobre "${formData?.topic || 'tema académico'}". ${aiInstructions}`
        : `Regenera la sección "${section}" del índice para un ${formData?.documentType || 'documento'} sobre "${formData?.topic || 'tema académico'}". ${aiInstructions}`;
      
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
        const newSectionContent = `<h3>${section} (Regenerado con IA)</h3><p>Contenido actualizado para "${section}" con las instrucciones: ${aiInstructions || 'Contenido estándar'}</p>`;
        
        if (quillRef.current) {
          quillRef.current.insertHTML(newSectionContent);
        }
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
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 8px;">Celda 4</td>
                <td style="border: 1px solid #e2e8f0; padding: 8px;">Celda 5</td>
                <td style="border: 1px solid #e2e8f0; padding: 8px;">Celda 6</td>
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
    <div className="space-y-4">
      {/* Fila 1: Resumen del documento - Horizontal completo */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Resumen del Documento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground">Título</p>
              <p className="font-semibold">{summary.title}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground">Tipo</p>
              <p className="font-semibold">{summary.type}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground">Secciones</p>
              <p className="font-semibold">{summary.sections}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground">Palabras</p>
              <p className="font-semibold">{summary.words}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground">Última modificación</p>
              <p className="font-semibold text-xs">{summary.lastModified}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fila 2: Editor principal con barra de herramientas superior - Horizontal completo */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Editor de Índice Avanzado
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
          {/* Barra de herramientas superior */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
            {/* Herramientas de IA */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Inteligencia Artificial</h4>
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
                    Rehacer con IA
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedSection === 'todo' ? 'Regenerar Índice Completo' : `Editar: ${selectedSection}`}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Instrucciones adicionales para la IA (opcional)..."
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAIRegenerate(selectedSection)}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Regenerando...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Regenerar
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
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertCustomElement('info-box')}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Info
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertCustomElement('note-box')}
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Nota
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertCustomElement('warning-box')}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Alerta
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => insertCustomElement('tip-box')}
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
                Insertar Tabla
              </Button>
            </div>

            {/* Secciones para editar */}
            {sections.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Editar Secciones</h4>
                <div className="max-h-20 overflow-y-auto">
                  {sections.slice(0, 3).map((section, index) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs px-2 py-1 h-auto mb-1"
                      onClick={() => {
                        setSelectedSection(section.text);
                        setIsAIDialogOpen(true);
                      }}
                    >
                      <span className="truncate">
                        {section.text.substring(0, 20)}...
                      </span>
                    </Button>
                  ))}
                  {sections.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{sections.length - 3} más</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Editor principal */}
          <div className="w-full">
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
                className="min-h-[600px]"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FullQuillIndexEditor;