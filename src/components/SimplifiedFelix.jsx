// src/components/SimplifiedFelix.jsx
import React from "react";

const SimplifiedFelix = () => {
  return (
    <div
      style={{
        padding: "40px 20px",
        textAlign: "center",
        position: "relative",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "1.5rem",
          color: "white",
        }}
      >
        <span style={{ color: "#1a8" }}>A</span>sistente
        <span style={{ color: "#1a8" }}> P</span>ersonal
      </h2>

      <p
        style={{
          color: "white",
          marginBottom: "3rem",
          maxWidth: "600px",
        }}
      >
        Conoce a nuestro asistente virtual que te ayudará en todas tus tareas
        académicas.
      </p>

      {/* Robot animado simple */}
      <div
        style={{
          position: "relative",
          width: "120px",
          height: "120px",
          marginBottom: "40px",
        }}
      >
        {/* Cabeza del robot */}
        <div
          style={{
            width: "120px",
            height: "120px",
            backgroundColor: "rgba(0, 150, 200, 0.7)",
            borderRadius: "60px",
            position: "relative",
            boxShadow: "0 0 30px rgba(0, 200, 255, 0.6)",
            animation: "pulse 3s infinite ease-in-out",
          }}
        >
          {/* Ojos */}
          <div
            style={{
              position: "absolute",
              width: "25px",
              height: "25px",
              backgroundColor: "white",
              borderRadius: "12px",
              top: "35px",
              left: "30px",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              width: "25px",
              height: "25px",
              backgroundColor: "white",
              borderRadius: "12px",
              top: "35px",
              right: "30px",
            }}
          ></div>

          {/* Boca */}
          <div
            style={{
              position: "absolute",
              width: "50px",
              height: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              borderRadius: "5px",
              bottom: "30px",
              left: "35px",
            }}
          ></div>
        </div>

        {/* Plataforma */}
        <div
          style={{
            width: "160px",
            height: "20px",
            backgroundColor: "rgba(200, 200, 255, 0.2)",
            borderRadius: "10px",
            position: "absolute",
            bottom: "-30px",
            left: "-20px",
            boxShadow: "0 0 20px rgba(100, 100, 255, 0.5)",
          }}
        ></div>
      </div>

      {/* Botones de acción */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {["Clima", "Hora", "Fecha", "Chiste", "Búsqueda", "Más"].map(
          (text, index) => (
            <button
              key={index}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "white",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "20px",
                padding: "10px 20px",
                fontSize: "14px",
                cursor: "pointer",
                backdropFilter: "blur(5px)",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.5)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
              }}
            >
              {text}
            </button>
          )
        )}
      </div>

      <style jsx="true">{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SimplifiedFelix;
