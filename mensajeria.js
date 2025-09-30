const nodemailer = require('nodemailer');

// Módulo de mensajería (demo)
function enviarMensaje(destino, asunto, mensaje) {
  // Aquí se integraría WhatsApp, email, interno
  return `Mensaje enviado a ${destino}: ${asunto}`;
}

function enviarEmail(destino, asunto, mensaje) {
  // Configuración demo, usar credenciales reales en producción
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: 'tucuenta@gmail.com', pass: 'tuclave' }
  });
  let mailOptions = {
    from: 'tucuenta@gmail.com',
    to: destino,
    subject: asunto,
    text: mensaje
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { enviarMensaje, enviarEmail };
