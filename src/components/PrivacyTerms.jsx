// src/components/PrivacyTerms.jsx
import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, X, Lock, Shield, Eye } from "lucide-react";

/**
 * Componente para la aceptación de políticas de privacidad
 *
 * @param {Object} props
 * @param {boolean} props.value - Estado de aceptación actual
 * @param {Function} props.onChange - Función a llamar cuando cambia el estado
 */
const PrivacyTerms = ({ value = false, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [localChecked, setLocalChecked] = useState(value);

  // Mantener sincronizado el estado local con el prop value
  useEffect(() => {
    setLocalChecked(value);
  }, [value]);

  // Manejar cambio en el checkbox
  const handleCheckboxChange = (checked) => {
    setLocalChecked(checked);
    // Siempre llamar al onChange aquí para evitar problemas de sincronización
    if (onChange) {
      // Es fundamental pasar checked aquí, no localChecked
      onChange(checked);
    }
  };

  // Abrir modal con términos completos
  const openTermsModal = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Aceptar términos desde el modal
  const acceptTerms = () => {
    // Primero actualizar estado local
    setLocalChecked(true);
    // Luego notificar al padre
    if (onChange) {
      onChange(true);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-2">
        <Checkbox
          id="privacy-terms"
          checked={localChecked}
          onCheckedChange={handleCheckboxChange}
          className="mt-1"
        />
        <div>
          <Label htmlFor="privacy-terms" className="text-sm cursor-pointer">
            Acepto la{" "}
            <button
              type="button"
              onClick={openTermsModal}
              className="text-primary hover:underline focus:outline-none"
              aria-label="Abrir Política de Privacidad"
            >
              Política de Privacidad
            </button>{" "}
            y autorizo el envío de información a mi WhatsApp
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="inline-flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              Tus datos están seguros y serán usados solo para este servicio
            </span>
          </p>
        </div>
      </div>

      {/* Modal de términos y condiciones */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Política de Privacidad y Tratamiento de Datos
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-base mb-1">
                      Información que recopilamos
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Recopilamos la siguiente información cuando utilizas
                      nuestro servicio:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
                      <li>Nombre o identificador personal</li>
                      <li>Número de teléfono para comunicarnos vía WhatsApp</li>
                      <li>Información académica como curso y carrera</li>
                      <li>Detalles del documento solicitado</li>
                      <li>Interacciones con nuestro servicio</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-base mb-1">
                      Uso de tu información
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Utilizamos tu información personal para los siguientes
                      propósitos:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
                      <li>Procesar tu solicitud de documento académico</li>
                      <li>
                        Contactarte vía WhatsApp para coordinar detalles y
                        entrega
                      </li>
                      <li>Mejorar nuestros servicios basados en el feedback</li>
                      <li>Cumplir con obligaciones legales aplicables</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-base mb-1">
                      Comunicación vía WhatsApp
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Al aceptar esta política:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
                      <li>
                        Autorizas explícitamente que te contactemos vía WhatsApp
                      </li>
                      <li>
                        Podemos enviarte información relacionada con tu pedido
                      </li>
                      <li>
                        Recibirás actualizaciones sobre el estado de tu
                        documento
                      </li>
                      <li>
                        Podrás responder y mantener una conversación activa con
                        nuestro equipo
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Nos comprometemos a no enviar mensajes promocionales no
                      solicitados o spam.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-base mb-1">Tus derechos</h4>
                    <p className="text-sm text-muted-foreground">
                      Tienes derecho a:
                    </p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-muted-foreground space-y-1">
                      <li>Acceder a tus datos personales que almacenamos</li>
                      <li>Solicitar la rectificación de datos incorrectos</li>
                      <li>Solicitar la eliminación de tus datos personales</li>
                      <li>
                        Revocar el consentimiento para comunicaciones futuras
                      </li>
                      <li>
                        Presentar una reclamación ante la autoridad de
                        protección de datos competente
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-2">
                      Para ejercer estos derechos, contáctanos a través de
                      nuestro correo electrónico.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-base mb-1">
                      Seguridad de datos
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Implementamos medidas de seguridad diseñadas para proteger
                      tus datos personales, incluyendo encriptación, acceso
                      restringido y monitoreo regular de nuestros sistemas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal}>
                Cancelar
              </Button>
              <Button onClick={acceptTerms}>Aceptar Términos</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyTerms;
