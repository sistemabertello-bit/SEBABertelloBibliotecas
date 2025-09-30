// Modelo de Usuario
module.exports = class Usuario {
  constructor({ id, dni, nombre, apellido, tipo, contacto, foto, estado, fechaAlta, historial }) {
    this.id = id;
    this.dni = dni;
    this.nombre = nombre;
    this.apellido = apellido;
    this.tipo = tipo; // Inicial, Primario, Secundario, Superior, Profesor, Externo
    this.contacto = contacto; // { email, whatsapp, direccion }
    this.foto = foto;
    this.estado = estado;
    this.fechaAlta = fechaAlta;
    this.historial = historial || [];
  }
}
