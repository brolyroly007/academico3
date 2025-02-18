// public/sw.js
self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);

  // Detectar solicitudes a localhost
  if (url.host === "localhost:5000") {
    // Crear una nueva URL con la API de Railway
    const newUrl = new URL(
      url.pathname,
      "https://academico3-production.up.railway.app"
    );

    // Clonar la solicitud pero con la nueva URL
    const modifiedRequest = new Request(newUrl.toString(), {
      method: event.request.method,
      headers: event.request.headers,
      body: event.request.body,
      mode: "cors",
      credentials: event.request.credentials,
      redirect: event.request.redirect,
    });

    // Responder con la solicitud modificada
    event.respondWith(fetch(modifiedRequest));
    return;
  }

  // Para otras solicitudes, comportamiento normal
  event.respondWith(fetch(event.request));
});
