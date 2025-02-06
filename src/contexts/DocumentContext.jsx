import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

export const DocumentContext = createContext(null);

export function useDocument() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument debe usarse dentro de un DocumentProvider");
  }
  return context;
}

export function DocumentProvider({ children }) {
  const [documentState, setDocumentState] = useState({
    isGenerating: false,
    currentStep: "form",
    generatedIndex: "",
    error: null,
  });

  const updateDocumentState = (newState) => {
    setDocumentState((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  const value = {
    documentState,
    updateDocumentState,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

DocumentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
