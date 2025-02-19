// Este script se carga antes que cualquier código de la aplicación
// y sobrescribe todas las solicitudes a localhost:5000 y railway.app
(function () {
  console.log("🛡️ Proxy API iniciado - Versión 2.0.0");

  // Función que intercepta todas las solicitudes a la API
  window.__proxyAPI = function (url) {
    // Si es una URL completa a localhost:5000 o railway.app
    if (typeof url === "string") {
      // Reemplazar localhost
      if (url.includes("localhost:5000")) {
        // Simplificar para usar el proxy de Vercel
        return url.replace(/https?:\/\/localhost:5000\/api\/(.*)/, "/api/$1");
      }

      // Reemplazar railway.app
      if (url.includes("railway.app")) {
        return url.replace(
          /https:\/\/academico3-production\.up\.railway\.app\/api\/(.*)/,
          "/api/$1"
        );
      }

      // Reemplazar render directo (para las URLs con doble slash)
      if (url.includes("academico3.onrender.com//api")) {
        return url.replace(
          "academico3.onrender.com//api",
          "academico3.onrender.com/api"
        );
      }
    }
    return url;
  };

  // Reemplazar fetch
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    const newUrl = window.__proxyAPI(url);
    if (newUrl !== url) {
      console.log(`🔄 Proxy: ${url} → ${newUrl}`);
    }
    return originalFetch(newUrl, options);
  };

  // Reemplazar XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    const newUrl = window.__proxyAPI(url);
    if (newUrl !== url) {
      console.log(`🔄 Proxy XHR: ${url} → ${newUrl}`);
    }
    return originalXHROpen.call(this, method, newUrl, ...args);
  };
})();
