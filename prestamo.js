// Modelo de Préstamo
module.exports = class Prestamo {
  constructor({ id, socioId, inventario, fechaPrestamo, fechaDevolucionPrevista, fechaDevolucionReal, estado, notas, excepciones }) {
    this.id = id;
    this.socioId = socioId;
    this.inventario = inventario;
    this.fechaPrestamo = fechaPrestamo;
    this.fechaDevolucionPrevista = fechaDevolucionPrevista;
    this.fechaDevolucionReal = fechaDevolucionReal;
    this.estado = estado;
    this.notas = notas;
    this.excepciones = excepciones || [];
  }
}
