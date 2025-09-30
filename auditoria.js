// Modelo de Auditoría/Log
module.exports = class Auditoria {
  constructor({ usuario, accion, fecha, modulo, detalles }) {
    this.usuario = usuario;
    this.accion = accion;
    this.fecha = fecha;
    this.modulo = modulo;
    this.detalles = detalles;
  }
}
