// src/utils/apiInterceptor.js
(function () {
  console.log("🛡️ Iniciando interceptor de API mejorado");

  // Guarda la implementación original de fetch
  const originalFetch = window.fetch;

  // Reemplaza fetch con nuestra versión mejorada
  window.fetch = function (url, options = {}) {
    // Log para debugging
    console.log(`🔍 Interceptor recibió solicitud a: ${url}`);

    let newUrl = url;

    // Si es un string, aplicar reemplazos
    if (typeof url === "string") {
      // Verificar y reemplazar localhost:5000
      if (url.includes("localhost:5000")) {
        newUrl = url.replace(
          "http://localhost:5000",
          "https://academico3.onrender.com"
        );
        console.log(`🔄 Redirigiendo: ${url} → ${newUrl}`);
      }
      // Verificar y reemplazar railway.app
      else if (url.includes("academico3-production.up.railway.app")) {
        newUrl = url.replace(
          "https://academico3-production.up.railway.app",
          "https://academico3.onrender.com"
        );
        console.log(`🔄 Redirigiendo: ${url} → ${newUrl}`);
      }

      // Corregir doble slash en URLs
      newUrl = newUrl.replace(/([^:]\/)\/+/g, "$1");
    }

    // Aseguramos que options sea un objeto
    options = options || {};

    // Llamar al fetch original con la URL corregida
    return originalFetch(newUrl, options).catch((error) => {
      console.error(`❌ Error en fetch interceptado para ${newUrl}:`, error);
      throw error;
    });
  };

  // También interceptar XMLHttpRequest para mayor seguridad
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    console.log(`🔍 XHR Interceptor recibió solicitud a: ${url}`);

    let newUrl = url;

    if (typeof url === "string") {
      // Reemplazar localhost
      if (url.includes("localhost:5000")) {
        newUrl = url.replace(
          "http://localhost:5000",
          "https://academico3.onrender.com"
        );
        console.log(`🔄 XHR redirigiendo: ${url} → ${newUrl}`);
      }
      // Reemplazar railway.app
      else if (url.includes("academico3-production.up.railway.app")) {
        newUrl = url.replace(
          "https://academico3-production.up.railway.app",
          "https://academico3.onrender.com"
        );
        console.log(`🔄 XHR redirigiendo: ${url} → ${newUrl}`);
      }

      // Corregir doble slash
      newUrl = newUrl.replace(/([^:]\/)\/+/g, "$1");
    }

    return originalXHROpen.call(this, method, newUrl, ...args);
  };

  console.log("✅ Interceptor de API mejorado instalado correctamente");

  // Monitoreo de solicitudes de red
  if (window.PerformanceObserver) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (
            entry.name &&
            (entry.name.includes("localhost:5000") ||
              entry.name.includes("railway.app"))
          ) {
            console.warn("⚠️ Solicitud no interceptada detectada:", entry.name);
          }
        });
      });
      observer.observe({ entryTypes: ["resource"] });
      console.log("📡 Monitoreo de red iniciado");
    } catch (e) {
      console.error("❌ Error configurando monitoreo:", e);
    }
  }
})();
