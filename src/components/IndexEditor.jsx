// src/components/IndexEditor.jsx
import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Table as TableIcon,
  Palette,
  RefreshCw,
  MessageSquare,
  Plus,
  Wand2,
  Edit3,
  Save,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

const IndexEditor = ({ initialContent, onSave, formData }) => {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isInstructionsDialogOpen, setIsInstructionsDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent || '<p>Cargando índice...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  // Funciones de formato
  const formatFunctions = {
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    bulletList: () => editor.chain().focus().toggleBulletList().run(),
    orderedList: () => editor.chain().focus().toggleOrderedList().run(),
    undo: () => editor.chain().focus().undo().run(),
    redo: () => editor.chain().focus().redo().run(),
    addTable: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    highlight: (color) => editor.chain().focus().toggleHighlight({ color }).run(),
    textColor: (color) => editor.chain().focus().setColor(color).run(),
  };

  // Función para rehacer sección con IA
  const handleAIRegenerate = async (section) => {
    setIsProcessing(true);
    try {
      // Aquí integrarías con tu API de IA
      const prompt = `Regenera la sección "${section}" del índice para un ${formData.documentType} sobre "${formData.topic}". ${aiInstructions}`;
      
      // Simulación de llamada a IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reemplazar contenido de la sección
      const newContent = `<h3>${section} (Regenerado con IA)</h3><p>Contenido actualizado para ${section} basado en las instrucciones proporcionadas...</p>`;
      
      // Insertar en el editor
      editor.chain().focus().insertContent(newContent).run();
      
      setIsAIDialogOpen(false);
      setAiInstructions('');
    } catch (error) {
      console.error('Error al regenerar con IA:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para rehacer todo el índice
  const handleRegenerateAll = async () => {
    setIsProcessing(true);
    try {
      const prompt = `Regenera completamente el índice para un ${formData.documentType} sobre "${formData.topic}" con formato ${formData.citationFormat}. ${aiInstructions}`;
      
      // Simulación de llamada a IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newFullContent = `
        <h1>ÍNDICE GENERAL</h1>
        <h2>I. INTRODUCCIÓN</h2>
        <p>1.1 Planteamiento del problema</p>
        <p>1.2 Justificación</p>
        <p>1.3 Objetivos</p>
        
        <h2>II. MARCO TEÓRICO</h2>
        <p>2.1 Antecedentes</p>
        <p>2.2 Bases teóricas</p>
        
        <h2>III. METODOLOGÍA</h2>
        <p>3.1 Tipo de investigación</p>
        <p>3.2 Técnicas e instrumentos</p>
        
        <h2>IV. RESULTADOS</h2>
        <p>4.1 Presentación de resultados</p>
        <p>4.2 Análisis</p>
        
        <h2>V. CONCLUSIONES</h2>
        <p>5.1 Conclusiones</p>
        <p>5.2 Recomendaciones</p>
        
        <h2>VI. REFERENCIAS BIBLIOGRÁFICAS</h2>
      `;
      
      editor.commands.setContent(newFullContent);
      setIsAIDialogOpen(false);
      setAiInstructions('');
    } catch (error) {
      console.error('Error al regenerar índice completo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para agregar cuadros/tablas
  const addContentBox = (type) => {
    let content = '';
    
    switch (type) {
      case 'table':
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        return;
      case 'highlight-box':
        content = '<div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 16px; margin: 16px 0;"><p><strong>Punto importante:</strong> Agregar contenido relevante aquí...</p></div>';
        break;
      case 'note-box':
        content = '<div style="background-color: #fefce8; border: 1px solid #eab308; border-radius: 8px; padding: 16px; margin: 16px 0;"><p><strong>Nota:</strong> Información adicional...</p></div>';
        break;
      case 'warning-box':
        content = '<div style="background-color: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 16px; margin: 16px 0;"><p><strong>Importante:</strong> Punto crítico a considerar...</p></div>';
        break;
    }
    
    editor.chain().focus().insertContent(content).run();
  };

  // Función para extraer secciones del contenido
  const extractSections = (content) => {
    const sections = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3');
    
    headings.forEach(heading => {
      sections.push(heading.textContent);
    });
    
    return sections;
  };

  const sections = editor ? extractSections(editor.getHTML()) : [];

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Editor de Índice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Herramientas de formato */}
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={formatFunctions.undo}
              disabled={!editor.can().undo()}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={formatFunctions.redo}
              disabled={!editor.can().redo()}
            >
              <Redo className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1"></div>
            
            <Button
              variant={editor.isActive('bold') ? 'default' : 'outline'}
              size="sm"
              onClick={formatFunctions.bold}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('italic') ? 'default' : 'outline'}
              size="sm"
              onClick={formatFunctions.italic}
            >
              <Italic className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1"></div>
            
            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'outline'}
              size="sm"
              onClick={formatFunctions.bulletList}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'outline'}
              size="sm"
              onClick={formatFunctions.orderedList}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1"></div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={formatFunctions.addTable}
            >
              <TableIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Opciones de contenido */}
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Cuadros
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Elementos</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => addContentBox('table')} className="h-auto p-4 flex-col">
                    <TableIcon className="w-6 h-6 mb-2" />
                    Tabla
                  </Button>
                  <Button onClick={() => addContentBox('highlight-box')} className="h-auto p-4 flex-col">
                    <Palette className="w-6 h-6 mb-2" />
                    Cuadro Destacado
                  </Button>
                  <Button onClick={() => addContentBox('note-box')} className="h-auto p-4 flex-col">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    Nota
                  </Button>
                  <Button onClick={() => addContentBox('warning-box')} className="h-auto p-4 flex-col">
                    <RefreshCw className="w-6 h-6 mb-2" />
                    Advertencia
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Rehacer todo con IA */}
            <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-purple-600"
                  onClick={() => {
                    setSelectedSection('todo');
                    setIsAIDialogOpen(true);
                  }}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Rehacer Todo con IA
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Regenerar Índice Completo</DialogTitle>
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
                      onClick={handleRegenerateAll}
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
                          Regenerar Todo
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

            <Button 
              onClick={() => onSave(editor.getHTML())}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>

          {/* Opciones por sección */}
          {sections.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Editar por sección:</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {section.substring(0, 30)}...
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setSelectedSection(section)}
                        >
                          <Wand2 className="w-3 h-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar: {section}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Instrucciones para regenerar esta sección..."
                            value={aiInstructions}
                            onChange={(e) => setAiInstructions(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleAIRegenerate(section)}
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
                                  Regenerar Sección
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
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardContent className="p-0">
          <EditorContent 
            editor={editor} 
            className="min-h-[500px] border-0 focus:ring-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default IndexEditor;