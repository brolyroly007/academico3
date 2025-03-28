// src/components/theme-provider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext({ theme: "light", setTheme: () => null });

export function ThemeProvider({ children, defaultTheme = "light" }) {
  // Inicializar el tema desde localStorage si existe, o usar el valor por defecto
  const [theme, setTheme] = useState(() => {
    // Verificar localStorage al inicializar
    const storedTheme = localStorage.getItem("theme");
    // Verificar preferencia del sistema
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Prioridad: localStorage > preferencia del sistema > defaultTheme
    return storedTheme || (prefersDark ? "dark" : defaultTheme);
  });

  // Aplicar el tema y guardarlo en localStorage
  useEffect(() => {
    // Guardar en localStorage para persistencia
    localStorage.setItem("theme", theme);

    // Aplicar el tema al documento HTML
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // También actualizar el atributo data-theme para componentes que usen ese atributo
    root.setAttribute("data-theme", theme);

    // Establecer meta tag para color de la interfaz móvil
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#0f172a" : "#ffffff"
      );
    }
  }, [theme]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Valor del contexto
  const value = {
    theme,
    setTheme,
    toggleTheme, // Añadimos una función de alternancia para facilitar su uso
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTheme: PropTypes.string,
};

export default ThemeProvider;
