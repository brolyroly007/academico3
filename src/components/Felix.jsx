// src/components/Felix.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Felix.css";

const Felix = () => {
  const [isActive, setIsActive] = useState(false);
  const [isInactive, setIsInactive] = useState(false);
  const [responseActive, setResponseActive] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();
  const felixRef = useRef(null);
  const timeoutRef = useRef(null);
  const userMadeDecisionRef = useRef(false);

  const ACTIVE_TIME_MS = 5000;
  const DEACTIVATION_TIME_MS = 750;

  const tips = [
    "Los documentos con estructura APA suelen tener mejor recepción académica.",
    "Organiza tus ideas antes de comenzar a redactar para un mejor flujo de información.",
    "No olvides añadir una introducción clara que explique el propósito de tu documento.",
    "Las conclusiones deben resumir tus puntos clave y no introducir información nueva.",
    "Utiliza párrafos cortos y concisos para mejorar la legibilidad.",
    "Una carátula profesional mejora la primera impresión de tu documento.",
    "Las referencias bibliográficas son esenciales para dar credibilidad a tu trabajo.",
  ];

  const activateFelix = () => {
    userMadeDecisionRef.current = false;
    setIsInactive(false);
    setIsActive(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timeout for deactivation if no command is selected
    timeoutRef.current = setTimeout(() => {
      if (!userMadeDecisionRef.current) {
        setIsActive(false);
        setIsInactive(true);
        setTimeout(() => {
          setIsInactive(false);
        }, DEACTIVATION_TIME_MS);
      }
    }, ACTIVE_TIME_MS);
  };

  const deactivateFelix = () => {
    userMadeDecisionRef.current = true;
    setIsActive(false);
    setIsInactive(true);

    setTimeout(() => {
      setIsInactive(false);
    }, DEACTIVATION_TIME_MS);
  };

  // Funciones para las acciones del robot adaptadas a RedactorIA
  const getTip = () => {
    const index = Math.floor(Math.random() * tips.length);
    setResponseMessage(`💡 Consejo académico: ${tips[index]}`);
    showResponse();
  };

  const getFormats = () => {
    setResponseMessage(
      "📚 Formatos disponibles: APA, MLA, Chicago y Vancouver. Cada uno tiene reglas específicas para citas y referencias que se aplicarán automáticamente en tu documento."
    );
    showResponse();
  };

  const getStructures = () => {
    setResponseMessage(
      "📑 Estructuras disponibles: \n• Estándar (Intro, Desarrollo, Conclusión)\n• Por Capítulos (numerados con subsecciones)\n• Académica (con marco teórico y metodología)"
    );
    showResponse();
  };

  const startProject = () => {
    deactivateFelix();
    navigate("/configuracion");
  };

  const showExamples = () => {
    setResponseMessage(
      "📝 RedactorIA puede generar diversos documentos académicos como ensayos, monografías, informes, reseñas, artículos científicos y más. Cada tipo tiene una estructura optimizada para su propósito específico."
    );
    showResponse();
  };

  const getHelp = () => {
    setResponseMessage(
      "💬 ¡Estoy aquí para ayudarte! Puedo orientarte sobre formatos de documentos, estructuras, consejos de redacción o guiarte en el proceso de generación de documentos académicos. ¡Solo haz clic en cualquiera de mis opciones!"
    );
    showResponse();
  };

  const showResponse = () => {
    setResponseActive(true);
    deactivateFelix();
  };

  const closeResponse = () => {
    setResponseActive(false);
  };

  // Cleanup effect to clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="felix-container">
      <h1 className="display-3 felix-title">
        <span>R</span>edactor<span>IA</span>
      </h1>
      <p className="lead felix-lead">
        Tu asistente personal para documentos académicos con inteligencia y
        personalidad.
      </p>

      <div className="personal-assistant">
        <div
          ref={felixRef}
          className={`felix ${isActive ? "active" : ""} ${
            isInactive ? "inactive" : ""
          }`}
          onClick={activateFelix}
        >
          <div className="eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
        </div>
        <div className="platform"></div>
        <ul className="command-list">
          <li onClick={getTip}>
            <i className="far fa-lightbulb"></i>
          </li>
          <li onClick={getFormats}>
            <i className="far fa-file-alt"></i>
          </li>
          <li onClick={getStructures}>
            <i className="far fa-list-alt"></i>
          </li>
          <li onClick={startProject}>
            <i className="far fa-edit"></i>
          </li>
          <li onClick={showExamples}>
            <i className="far fa-copy"></i>
          </li>
          <li onClick={getHelp}>
            <i className="far fa-question-circle"></i>
          </li>
          <p className="hey-felix lead"></p>
        </ul>
      </div>

      <div className={`response-frame ${responseActive ? "active" : ""}`}>
        <p className="lead response-message">{responseMessage}</p>
        <i className="fas fa-times" onClick={closeResponse}></i>
      </div>
    </div>
  );
};

export default Felix;
