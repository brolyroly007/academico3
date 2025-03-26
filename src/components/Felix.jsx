// src/components/Felix.jsx
import { useState, useEffect, useRef } from "react";
import "./Felix.css";
import React from "react";

// Definición de estilos inline para asegurar visibilidad
const styles = {
  felixContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    padding: "2rem 0",
    minHeight: "450px",
    position: "relative",
    zIndex: 5,
  },
  felixTitle: {
    fontSize: "3rem",
    marginBottom: "1rem",
    color: "white",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  felixTitleSpan: {
    color: "#1a8",
    fontWeight: "bolder",
  },
  felixLead: {
    maxWidth: "600px",
    textAlign: "center",
    marginBottom: "2rem",
    color: "white",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  },
  personalAssistant: {
    position: "relative",
    marginTop: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    zIndex: 10,
  },
  felix: {
    position: "absolute",
    bottom: "50px",
    width: "110px",
    height: "95px",
    borderRadius: "45%",
    border: "3px solid #10f1e6",
    boxShadow: "0 0 5px rgba(6, 207, 174, 0.5)",
    cursor: "pointer",
    zIndex: 20,
  },
  eyes: {
    position: "relative",
  },
  eyeBase: {
    position: "absolute",
    top: "20px",
    width: "20px",
    height: "25px",
    borderRadius: "15px",
    backgroundColor: "rgb(224, 213, 217)",
    boxShadow: "0 0 12px rgba(199, 171, 171, 0.5)",
  },
  eyeLeft: {
    left: "25%",
  },
  eyeRight: {
    right: "25%",
  },
  platform: {
    transform: "rotateX(70deg)",
    width: "100px",
    height: "100px",
    boxShadow: "0 0 100px #fff, 0 0 15px #fff inset",
    borderRadius: "50%",
    transition: "0.2s linear all",
    zIndex: 2,
  },
  commandList: {
    position: "absolute",
    bottom: "35px",
    listStyle: "none",
    padding: 0,
    margin: 0,
    width: "100%",
    zIndex: 5,
    display: "flex",
    justifyContent: "center",
  },
  commandItem: {
    width: "45px",
    height: "45px",
    lineHeight: "45px",
    textAlign: "center",
    fontSize: "25px",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 0 5px #fff",
    margin: "10px 12px",
    cursor: "pointer",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "absolute",
  },
  commandItem1: { transform: "translateX(100px) translateY(45px)" },
  commandItem2: { transform: "translateX(-15px) translateY(-15px)" },
  commandItem3: { transform: "translateX(-35px) translateY(-55px)" },
  commandItem4: { transform: "translateX(35px) translateY(-55px)" },
  commandItem5: { transform: "translateX(15px) translateY(-15px)" },
  commandItem6: { transform: "translateX(-100px) translateY(45px)" },
  heyFelix: {
    position: "relative",
    transform: "translateY(50px)",
    margin: 0,
  },
  responseFrame: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: -1,
    opacity: 0,
    transition: "opacity 0.3s ease, z-index 0s 0.3s",
  },
  responseFrameActive: {
    zIndex: 1000,
    opacity: 1,
    transition: "opacity 0.3s ease",
  },
  responseMessage: {
    padding: "20px",
    margin: "20px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    color: "#333",
    maxWidth: "600px",
    textAlign: "center",
  },
  closeButton: {
    width: "50px",
    height: "50px",
    fontSize: "20px",
    borderRadius: "50%",
    border: "2px solid #fff",
    backgroundColor: "transparent",
    color: "white",
    boxShadow: "0 0 10px #fff, 0 0 5px #fff inset",
    transition: "0.3s linear all",
    cursor: "pointer",
  },
};

const Felix = () => {
  const [isActive, setIsActive] = useState(false);
  const [isInactive, setIsInactive] = useState(false);
  const [responseActive, setResponseActive] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const felixRef = useRef(null);
  const timeoutRef = useRef(null);
  const userMadeDecisionRef = useRef(false);

  const ACTIVE_TIME_MS = 5000;
  const DEACTIVATION_TIME_MS = 750;

  // Usando comillas dobles para evitar problemas con los apóstrofes
  const jokes = [
    "I ate a clock yesterday, it was very time-consuming.",
    "A perfectionist walked into a bar...apparently, the bar wasn't set high enough.",
    "Employee of the month is a good example of how somebody can be both a winner and a loser at the same time.",
    "I don't have a girlfriend, but I know a girl that would get really mad if she heard me say that.",
    "Relationships are great, but have you ever had stuffed crust pizza?",
    "The worst time to have a heart attack is during a game of charades.",
    "My therapist says I have a preoccupation with vengeance. We'll see about that.",
    "I have a friend. He keeps trying to convince me he's a compulsive liar, but I don't believe him.",
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

  const getWeather = () => {
    setResponseMessage(
      "El clima realmente está algo impredecible hoy, y sé que querías el clima en tu ubicación, pero así es la vida."
    );
    showResponse();
  };

  const getTime = () => {
    const today = new Date();
    const time =
      today.getHours() +
      ":" +
      (today.getMinutes() < 10 ? "0" : "") +
      today.getMinutes();
    setResponseMessage(
      `¿Quizás es hora de que consigas un reloj? Solo bromeo... No. En serio... Son las ${time}.`
    );
    showResponse();
  };

  const getDate = () => {
    const today = new Date();
    const date =
      today.getDate() +
      "/" +
      (today.getMonth() + 1) +
      "/" +
      today.getFullYear();
    setResponseMessage(
      `Un calendario es una gran inversión, ¿sabes? Incluso tu computadora tiene uno. Ya que preguntaste, hoy es ${date}.`
    );
    showResponse();
  };

  const tellJoke = () => {
    const index = Math.floor(Math.random() * jokes.length);
    setResponseMessage(jokes[index]);
    showResponse();
  };

  const searchGoogle = () => {
    deactivateFelix();
    window.open("https://www.google.com/", "_blank");
  };

  const showInspiration = () => {
    deactivateFelix();
    window.open("https://youtu.be/GXTnf6owAcA", "_blank");
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

  // Get computed styles for Felix elements based on state
  const getFelixStyle = () => {
    let additionalStyles = {};

    if (isActive) {
      additionalStyles = {
        animation: "bounce-then-breathe 5s linear infinite",
        borderColor: "#5fc",
        boxShadow: "0 0 5px #5fc",
        background: "linear-gradient(to bottom, #5fc, #1a8)",
      };
    } else if (isInactive) {
      additionalStyles = {
        animation:
          "deactivate 0.75s linear, breathe-and-jump 3s linear infinite",
      };
    } else {
      additionalStyles = {
        animation: "breathe-and-jump 3s linear infinite",
      };
    }

    return { ...styles.felix, ...additionalStyles };
  };

  return (
    <div style={styles.felixContainer}>
      <h1 style={styles.felixTitle}>
        <span style={styles.felixTitleSpan}>H</span>ola{" "}
        <span style={styles.felixTitleSpan}>a</span>migo!
      </h1>
      <p style={styles.felixLead}>
        Conoce a Indiamoon, tu nuevo asistente personal con una personalidad
        excepcional.
      </p>

      <div style={styles.personalAssistant}>
        <div ref={felixRef} style={getFelixStyle()} onClick={activateFelix}>
          <div style={styles.eyes}>
            <div style={{ ...styles.eyeBase, ...styles.eyeLeft }}></div>
            <div style={{ ...styles.eyeBase, ...styles.eyeRight }}></div>
          </div>
        </div>
        <div style={styles.platform}></div>
        <ul style={styles.commandList}>
          <li
            style={{
              ...styles.commandItem,
              ...styles.commandItem1,
              opacity: isActive ? 1 : 0,
              display: isActive ? "block" : "none",
            }}
            onClick={getWeather}
          >
            ☁️
          </li>
          <li
            style={{
              ...styles.commandItem,
              ...styles.commandItem2,
              opacity: isActive ? 1 : 0,
              display: isActive ? "block" : "none",
            }}
            onClick={getTime}
          >
            🕒
          </li>
          <li
            style={{
              ...styles.commandItem,
              ...styles.commandItem3,
              opacity: isActive ? 1 : 0,
              display: isActive ? "block" : "none",
            }}
            onClick={getDate}
          >
            📅
          </li>
          <li
            style={{
              ...styles.commandItem,
              ...styles.commandItem4,
              opacity: isActive ? 1 : 0,
              display: isActive ? "block" : "none",
            }}
            onClick={tellJoke}
          >
            😂
          </li>
          <li
            style={{
              ...styles.commandItem,
              ...styles.commandItem5,
              opacity: isActive ? 1 : 0,
              display: isActive ? "block" : "none",
            }}
            onClick={searchGoogle}
          >
            🔍
          </li>
          <li
            style={{
              ...styles.commandItem,
              ...styles.commandItem6,
              opacity: isActive ? 1 : 0,
              display: isActive ? "block" : "none",
            }}
            onClick={showInspiration}
          >
            💡
          </li>
          <p style={styles.heyFelix}></p>
        </ul>
      </div>

      <div
        style={
          responseActive
            ? { ...styles.responseFrame, ...styles.responseFrameActive }
            : styles.responseFrame
        }
      >
        <p style={styles.responseMessage}>{responseMessage}</p>
        <button style={styles.closeButton} onClick={closeResponse}>
          ✖️
        </button>
      </div>
    </div>
  );
};

export default Felix;
