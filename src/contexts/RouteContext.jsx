// src/contexts/RouteContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteContext = createContext({
  isHomePage: false,
});

export function RouteProvider({ children }) {
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(location.pathname === "/");

  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location.pathname]);

  return (
    <RouteContext.Provider value={{ isHomePage }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  return useContext(RouteContext);
}
