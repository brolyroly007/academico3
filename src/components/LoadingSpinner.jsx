// LoadingSpinner.jsx
import { useDocument } from "../contexts/DocumentContext";
import { Loader2 } from "lucide-react";

// Default loading spinner for lazy components
export function SimpleLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Cargando...
        </p>
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  try {
    const { documentState } = useDocument();
    const { isGenerating } = documentState;

    if (!isGenerating) return null;
  } catch (error) {
    // If DocumentContext is not available, don't show the spinner
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center border border-border">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-lg font-medium text-foreground">
          Generando documento...
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Esto puede tomar unos minutos
        </p>
      </div>
    </div>
  );
}
