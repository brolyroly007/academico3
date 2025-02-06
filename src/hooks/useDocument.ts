import { useContext } from "react";
import { DocumentContext } from "../contexts/DocumentContext";

export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument debe usarse dentro de un DocumentProvider");
  }
  return context;
};
