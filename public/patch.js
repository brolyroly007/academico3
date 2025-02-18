// public/patch.js
(function () {
  console.log("🔧 Iniciando parche de URLs...");

  // Esperar a que el documento esté totalmente cargado
  window.addEventListener("load", function () {
    // Establecer un intervalo para revisar periódicamente
    const interval = setInterval(function () {
      // Buscar todas las solicitudes fetch en curso
      const fetchRequests = performance
        .getEntriesByType("resource")
        .filter(
          (r) =>
            r.name.includes("localhost:5000") || r.name.includes("railway.app")
        );

      if (fetchRequests.length > 0) {
        console.warn("⚠️ Detectadas solicitudes a redireccionar");

        // Reemplazar la función fetch global
        const originalFetch = window.fetch;
        window.fetch = function (url, options) {
          if (typeof url === "string") {
            if (url.includes("localhost:5000")) {
              const newUrl = url.replace(
                "http://localhost:5000",
                "https://academico3.onrender.com"
              );
              console.log(`🔄 Redirigiendo localhost: ${url} → ${newUrl}`);
              url = newUrl;
            } else if (url.includes("academico3-production.up.railway.app")) {
              const newUrl = url.replace(
                "https://academico3-production.up.railway.app",
                "https://academico3.onrender.com"
              );
              console.log(`🔄 Redirigiendo Railway: ${url} → ${newUrl}`);
              url = newUrl;
            }
          }
          return originalFetch(url, options);
        };

        // Detener el intervalo una vez que se ha aplicado el parche
        clearInterval(interval);
        console.log("✅ Parche aplicado correctamente");
      }
    }, 500); // Revisar cada 500ms

    // Detener el intervalo después de 10 segundos para evitar bucles infinitos
    setTimeout(() => clearInterval(interval), 10000);
  });
})();
