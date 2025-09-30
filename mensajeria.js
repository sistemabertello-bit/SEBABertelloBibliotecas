// Módulo de mensajería (demo)
function enviarMensaje(destino, asunto, mensaje) {
  // Aquí se integraría WhatsApp, email, interno
  return `Mensaje enviado a ${destino}: ${asunto}`;
}

module.exports = { enviarMensaje };
