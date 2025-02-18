// src/utils/apiInterceptor.js
(function () {
  // Guarda la implementación original de fetch
  const originalFetch = window.fetch;

  // Reemplaza fetch con nuestra versión
  window.fetch = function (url, options) {
    // Si la URL contiene localhost:5000, reemplázala
    if (typeof url === "string" && url.includes("localhost:5000")) {
      console.warn("⚠️ INTERCEPTOR: Bloqueando solicitud a localhost:5000");
      const newUrl = url.replace(
        "http://localhost:5000",
        "https://academico3-production.up.railway.app"
      );
      console.log("🔄 INTERCEPTOR: Redirigiendo a:", newUrl);
      url = newUrl;
    }

    // Llama al fetch original con la URL posiblemente modificada
    return originalFetch(url, options);
  };

  console.log(
    "🛡️ Interceptor de API inicializado - Protegiendo contra URLs locales"
  );
})();
