// useAcademicForm.js
import { useState } from "react";
import { useDocument } from "../contexts/DocumentContext";
import DocumentService from "../services/DocumentService";
import { useToast } from "@/components/ui/use-toast";

export function useAcademicForm() {
  const { documentState, updateDocumentState } = useDocument();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    documentType: "ensayo",
    topic: "",
    citationFormat: "APA",
    length: "Mediano",
    course: "",
    career: "",
    essayTone: "Formal",
    additionalStructure: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreviewGeneration = async () => {
    try {
      updateDocumentState({ isGenerating: true });
      const index = await DocumentService.generateIndex(formData);
      updateDocumentState({
        currentStep: "preview",
        generatedIndex: index,
      });
    } catch (err) {
      console.error(err); // Agregado para debugging
      toast({
        title: "Error",
        description: "No se pudo generar la vista previa del índice",
        variant: "destructive",
      });
    } finally {
      updateDocumentState({ isGenerating: false });
    }
  };

  const handleDocumentGeneration = async () => {
    try {
      updateDocumentState({ isGenerating: true });
      const formDataObj = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });
      formDataObj.append("indiceModificado", documentState.generatedIndex);

      const blob = await DocumentService.generateDocument(formDataObj);
      DocumentService.downloadDocument(
        blob,
        `${formData.documentType}_${formData.topic.replace(/\s+/g, "_")}.docx`
      );

      toast({
        title: "Éxito",
        description: "Documento generado correctamente",
      });
    } catch (err) {
      console.error(err); // Agregado para debugging
      toast({
        title: "Error",
        description: "No se pudo generar el documento",
        variant: "destructive",
      });
    } finally {
      updateDocumentState({ isGenerating: false });
    }
  };

  return {
    formData,
    handleInputChange,
    handlePreviewGeneration,
    handleDocumentGeneration,
  };
}
