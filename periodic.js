// periodic.js
// Comunicación periódica con el servidor central

function getRegistro() {
  const reg = localStorage.getItem('registro');
  if (!reg) return null;
  return JSON.parse(reg);
}

function getIP() {
  return fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => data.ip)
    .catch(() => 'desconocida');
}

async function enviarPing() {
  const datos = getRegistro();
  if (!datos || !datos.acepto) return;
  const ip = await getIP();
  const payload = { ...datos, ip };
  try {
    await fetch('https://tuservidorcentral.com/api/ping', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    // Silenciar error, reintentar luego
  }
}

// Ejecutar cada 30 minutos
setInterval(enviarPing, 1800000);
// Ejecutar al iniciar
window.onload = enviarPing;
