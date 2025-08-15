// src/components/SimpleIndexEditor.jsx
import React, { useState } from 'react';
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

const SimpleIndexEditor = ({ initialContent, onSave, formData }) => {
  const [content, setContent] = useState(initialContent || '');
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [aiInstructions, setAiInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Función para rehacer sección con IA (simulada)
  const handleAIRegenerate = async (section) => {
    setIsProcessing(true);
    try {
      // Simulación de llamada a IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newContent = `${content}\n\n[REGENERADO CON IA] ${section}\n- Contenido actualizado basado en las instrucciones\n- Sección mejorada para ${formData.documentType}\n`;
      
      setContent(newContent);
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
      // Simulación de llamada a IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newFullContent = `ÍNDICE GENERAL - ${formData.documentType.toUpperCase()}
Tema: ${formData.topic}

I. INTRODUCCIÓN
   1.1 Planteamiento del problema
   1.2 Justificación del estudio
   1.3 Objetivos de la investigación

II. MARCO TEÓRICO
   2.1 Antecedentes de la investigación
   2.2 Bases teóricas fundamentales
   2.3 Marco conceptual

III. METODOLOGÍA
   3.1 Tipo de investigación
   3.2 Diseño metodológico
   3.3 Técnicas e instrumentos

IV. DESARROLLO
   4.1 Análisis principal
   4.2 Resultados obtenidos
   4.3 Discusión de hallazgos

V. CONCLUSIONES
   5.1 Conclusiones generales
   5.2 Recomendaciones
   5.3 Líneas futuras de investigación

VI. REFERENCIAS BIBLIOGRÁFICAS

VII. ANEXOS`;
      
      setContent(newFullContent);
      setIsAIDialogOpen(false);
      setAiInstructions('');
    } catch (error) {
      console.error('Error al regenerar índice completo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para agregar contenido predefinido
  const addContentBox = (type) => {
    let newContent = '';
    
    switch (type) {
      case 'table':
        newContent = `${content}\n\n[TABLA]\n| Encabezado 1 | Encabezado 2 | Encabezado 3 |\n|-------------|-------------|-------------|\n| Fila 1      | Dato 1      | Dato 2      |\n| Fila 2      | Dato 3      | Dato 4      |\n`;
        break;
      case 'highlight-box':
        newContent = `${content}\n\n[PUNTO IMPORTANTE]\n📌 Información relevante que requiere atención especial.\n`;
        break;
      case 'note-box':
        newContent = `${content}\n\n[NOTA]\n💡 Información adicional que complementa el contenido principal.\n`;
        break;
      case 'warning-box':
        newContent = `${content}\n\n[IMPORTANTE]\n⚠️ Punto crítico que debe ser considerado cuidadosamente.\n`;
        break;
    }
    
    setContent(newContent);
  };

  // Función para extraer secciones del contenido
  const extractSections = (text) => {
    const lines = text.split('\n');
    const sections = [];
    
    lines.forEach(line => {
      if (line.match(/^[IVX]+\.|^\d+\./)) {
        sections.push(line.trim());
      }
    });
    
    return sections.slice(0, 10); // Limitar a 10 secciones
  };

  const sections = extractSections(content);

  return (
    <div className="space-y-4">
      {/* Barra de herramientas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Editor de Índice Simplificado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Herramientas básicas de formato */}
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContent(content + '\n\n**Texto en Negrita**')}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContent(content + '\n\n*Texto en Cursiva*')}
            >
              <Italic className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1"></div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContent(content + '\n\n• Elemento de lista\n• Otro elemento')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContent(content + '\n\n1. Primer elemento\n2. Segundo elemento')}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
          </div>

          {/* Opciones de contenido */}
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Elementos
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
                    Punto Importante
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
              onClick={() => onSave(content)}
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

      {/* Editor de texto simple */}
      <Card>
        <CardContent className="p-0">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] font-mono text-sm resize-none border-0 focus:ring-0"
            placeholder="Contenido del índice..."
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleIndexEditor;