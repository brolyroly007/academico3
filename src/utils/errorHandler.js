import { toast } from "../hooks/use-toast";

export const handleError = (error, customMessage = "") => {
  console.error(error);
  toast({
    title: "Error",
    description: customMessage || error.message,
    variant: "destructive",
  });
};

export const handleSuccess = (message) => {
  toast({
    title: "Éxito",
    description: message,
  });
};
