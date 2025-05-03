// src/components/WhatsAppWidget.jsx
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "51961484114";
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  const handleStartChat = () => {
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Widget de chat expandible */}
      {isOpen && (
        <Card className="mb-4 w-80 shadow-xl animate-in slide-in-from-bottom-4">
          <div className="bg-[#25D366] p-4 rounded-t-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full" />
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div className="text-white">
                  <h3 className="font-medium">Soporte RedactorIA</h3>
                  <p className="text-sm opacity-90">En línea</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-lg rounded-tl-none">
                <p className="text-sm">¡Hola! 👋 ¿Cómo podemos ayudarte?</p>
              </div>
              <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-lg">
                <p className="text-sm">
                  Estamos aquí para resolver tus dudas...
                </p>
              </div>
              <Button
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2"
                onClick={handleStartChat}
              >
                <Send className="w-4 h-4" />
                Iniciar Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botón principal */}
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg transition-all duration-300 group"
        >
          {isOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white" />
          )}
        </Button>

        {/* Notificación de burbuja */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white" />
        )}
      </div>
    </div>
  );
}

export default WhatsAppWidget;
