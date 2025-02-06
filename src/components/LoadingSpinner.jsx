// LoadingSpinner.jsx
import { useDocument } from "../contexts/DocumentContext";

export function LoadingSpinner() {
  const { documentState } = useDocument();
  const { isGenerating } = documentState;

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-blue-200"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          Generando documento...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Esto puede tomar unos minutos
        </p>
      </div>
    </div>
  );
}
