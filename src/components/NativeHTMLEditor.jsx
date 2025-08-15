import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/native-editor.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Save,
  Wand2,
  RefreshCw,
  Edit3,
  Table,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Zap,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eye,
  Type,
  Palette
} from 'lucide-react';

const NativeHTMLEditor = ({ initialContent, onSave, formData }) => {
  const [content, setContent] = useState(initialContent || '');
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const editorRef = useRef(null);

  // Aplicar el contenido inicial al editor
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // Función para obtener el contenido del editor
  const getEditorContent = useCallback(() => {
    return editorRef.current ? editorRef.current.innerHTML : '';
  }, []);

  // Función para actualizar el contenido
  const updateContent = useCallback(() => {
    const newContent = getEditorContent();
    setContent(newContent);
  }, [getEditorContent]);

  // Comandos de formato
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  }, [updateContent]);

  // Funciones de formato específicas
  const formatText = {
    bold: () => execCommand('bold'),
    italic: () => execCommand('italic'),
    underline: () => execCommand('underline'),
    insertUnorderedList: () => execCommand('insertUnorderedList'),
    insertOrderedList: () => execCommand('insertOrderedList'),
    justifyLeft: () => execCommand('justifyLeft'),
    justifyCenter: () => execCommand('justifyCenter'),
    justifyRight: () => execCommand('justifyRight'),
    formatBlock: (tag) => execCommand('formatBlock', tag),
    foreColor: (color) => execCommand('foreColor', color),
    hiliteColor: (color) => execCommand('hiliteColor', color)
  };

  // Insertar elementos personalizados
  const insertCustomElement = useCallback((type) => {
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
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background-color: #f8fafc;">
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: 600;">Encabezado 1</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: 600;">Encabezado 2</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: 600;">Encabezado 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #e2e8f0; padding: 12px;">Celda 1</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px;">Celda 2</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px;">Celda 3</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="border: 1px solid #e2e8f0; padding: 12px;">Celda 4</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px;">Celda 5</td>
                <td style="border: 1px solid #e2e8f0; padding: 12px;">Celda 6</td>
              </tr>
            </tbody>
          </table>
        `;
        break;
    }
    
    execCommand('insertHTML', htmlContent);
  }, [execCommand]);

  // Manejar hover en secciones
  useEffect(() => {
    if (editorRef.current && !isPreviewMode) {
      const handleSectionHover = (e) => {
        if (e.target.matches('h1, h2, h3, h4, h5, h6')) {
          // Limpiar botones existentes
          document.querySelectorAll('.section-hover-btn').forEach(btn => btn.remove());
          
          // Crear botón hover
          const button = document.createElement('button');
          button.className = 'section-hover-btn';
          button.innerHTML = `
            <div style="
              position: absolute;
              top: -8px;
              right: 8px;
              background: #8b5cf6;
              color: white;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
              z-index: 1000;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              transition: all 0.2s ease;
            " onmouseover="this.style.background='#7c3aed'" onmouseout="this.style.background='#8b5cf6'">
              ✏️ Editar
            </div>
          `;
          
          button.onclick = (event) => {
            event.stopPropagation();
            setSelectedSection(e.target.textContent.trim());
            setIsAIDialogOpen(true);
          };
          
          e.target.style.position = 'relative';
          e.target.appendChild(button);
        }
      };

      const handleSectionLeave = (e) => {
        if (e.target.matches('h1, h2, h3, h4, h5, h6')) {
          setTimeout(() => {
            const buttons = e.target.querySelectorAll('.section-hover-btn');
            buttons.forEach(btn => btn.remove());
          }, 100);
        }
      };

      editorRef.current.addEventListener('mouseover', handleSectionHover);
      editorRef.current.addEventListener('mouseout', handleSectionLeave);

      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener('mouseover', handleSectionHover);
          editorRef.current.removeEventListener('mouseout', handleSectionLeave);
        }
      };
    }
  }, [isPreviewMode]);

  // Función de regeneración con IA
  const handleAIRegenerate = async (section) => {
    setIsProcessing(true);
    try {
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
        if (editorRef.current) {
          editorRef.current.innerHTML = newFullContent;
        }
      } else {
        const newSectionContent = `<h3>${section} (Regenerado con IA)</h3><p style="margin-left: 20px;"><em>Contenido actualizado para "${section}" basado en: ${aiInstructions || 'Indicaciones estándar'}</em></p>`;
        execCommand('insertHTML', newSectionContent);
      }
      
      setIsAIDialogOpen(false);
      setAiInstructions('');
    } catch (error) {
      console.error('Error al regenerar con IA:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Extraer secciones del contenido
  const extractSections = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    return Array.from(headings).map((heading, index) => ({
      level: parseInt(heading.tagName.charAt(1)),
      text: heading.textContent.trim(),
      id: `section-${index}`
    }));
  };

  const sections = extractSections(content);

  // Estadísticas del documento
  const getDocumentSummary = () => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    const sectionCount = sections.length;
    
    return {
      title: formData?.topic || 'Sin título',
      type: formData?.documentType || 'Documento',
      sections: sectionCount,
      words: wordCount,
      lastModified: new Date().toLocaleString('es-ES')
    };
  };

  const summary = getDocumentSummary();

  return (
    <div className="w-full space-y-4">
      {/* Estadísticas del documento */}
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

      {/* Editor principal */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Editor de Índice Nativo
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
                onClick={() => onSave(getEditorContent())}
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
          {/* Barra de herramientas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
            {/* Formato de texto */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Formato</h4>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={formatText.bold} className="p-2">
                  <Bold className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={formatText.italic} className="p-2">
                  <Italic className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={formatText.underline} className="p-2">
                  <Underline className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Listas y alineación */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Listas</h4>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={formatText.insertUnorderedList} className="p-2">
                  <List className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={formatText.insertOrderedList} className="p-2">
                  <ListOrdered className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Encabezados */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Encabezados</h4>
              <select 
                onChange={(e) => formatText.formatBlock(e.target.value)}
                className="w-full p-1 border rounded text-xs"
              >
                <option value="">Seleccionar</option>
                <option value="h1">Encabezado 1</option>
                <option value="h2">Encabezado 2</option>
                <option value="h3">Encabezado 3</option>
                <option value="p">Párrafo</option>
              </select>
            </div>

            {/* IA */}
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
                    className="w-full text-purple-600"
                    onClick={() => {
                      setSelectedSection('todo');
                      setIsAIDialogOpen(true);
                    }}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Rehacer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Wand2 className="w-5 h-5" />
                      {selectedSection === 'todo' ? 'Regenerar Índice Completo' : `Editar: ${selectedSection}`}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder={selectedSection === 'todo' 
                        ? "Instrucciones para regenerar todo el índice..."
                        : `Instrucciones para la sección "${selectedSection}"...`
                      }
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      rows={4}
                    />
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

            {/* Elementos */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Elementos</h4>
              <div className="grid grid-cols-2 gap-1">
                <Button variant="outline" size="sm" onClick={() => insertCustomElement('info-box')} className="text-xs">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Info
                </Button>
                <Button variant="outline" size="sm" onClick={() => insertCustomElement('note-box')} className="text-xs">
                  📝
                </Button>
                <Button variant="outline" size="sm" onClick={() => insertCustomElement('warning-box')} className="text-xs">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Alert
                </Button>
                <Button variant="outline" size="sm" onClick={() => insertCustomElement('tip-box')} className="text-xs">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Tip
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
          </div>

          {/* Editor */}
          <div className="w-full">
            {isPreviewMode ? (
              <div 
                className="prose prose-sm max-w-none p-6 min-h-[600px] bg-white border rounded-lg"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div
                ref={editorRef}
                contentEditable
                onInput={updateContent}
                onBlur={updateContent}
                className="native-editor w-full min-h-[600px] p-6 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 prose prose-sm max-w-none"
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}
                suppressContentEditableWarning={true}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NativeHTMLEditor;