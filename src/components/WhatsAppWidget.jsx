// src/components/WhatsAppWidget.jsx
import { useState } from "react";
import { MessageCircle, X, Send, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "51961484114";
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  // Configuración personalizable
  const config = {
    profileImage: "/logow.jpg", // Tu imagen de perfil
    agentName: "RedactorIA",
    businessName: "Soporte",
    welcomeMessage: "¡Hola! 👋 ¿Cómo podemos ayudarte?",
    secondMessage: "Estamos aquí para resolver tus dudas...",
  };

  const handleStartChat = () => {
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Ventana de chat desplegable */}
      {isOpen && (
        <div className="mb-4 w-[320px] sm:w-[380px]">
          <Card className="shadow-2xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Header del chat */}
            <div className="bg-[#25D366] p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={config.profileImage}
                      alt="Perfil"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <div className="text-white">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {config.agentName}
                      </h3>
                      <CheckCheck className="w-5 h-5 text-blue-300" />
                    </div>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      {config.businessName}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Cuerpo del chat */}
            <CardContent className="p-0">
              <div className="bg-[#ECE5DD] dark:bg-gray-800 p-4 h-[200px] overflow-y-auto">
                {/* Mensaje de bienvenida */}
                <div className="flex gap-2 mb-3">
                  <div className="flex-shrink-0">
                    <img
                      src={config.profileImage}
                      alt="Perfil"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl rounded-tl-none shadow-sm">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {config.welcomeMessage}
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>12:30 PM</span>
                        <CheckCheck className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segundo mensaje */}
                <div className="flex gap-2 mb-3">
                  <div className="flex-shrink-0">
                    <img
                      src={config.profileImage}
                      alt="Perfil"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-xl rounded-tl-none shadow-sm">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {config.secondMessage}
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>12:30 PM</span>
                        <CheckCheck className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensaje de inicio de chat */}
                <div className="flex justify-center mb-3">
                  <div className="bg-[#E7F3F8] dark:bg-gray-600 px-4 py-2 rounded-full">
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Hoy
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de iniciar chat */}
              <div className="p-4 bg-white dark:bg-gray-900">
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white gap-2 shadow-lg"
                  onClick={handleStartChat}
                >
                  <Send className="w-4 h-4" />
                  Iniciar Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botón principal */}
      <div className="relative group">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg",
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-[#25D366] hover:bg-[#128C7E]"
          )}
        >
          {isOpen ? (
            <X className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          ) : (
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          )}
        </Button>

        {/* Indicador de notificación */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-4 ring-white dark:ring-gray-900" />
        )}
      </div>
    </div>
  );
}

export default WhatsAppWidget;
