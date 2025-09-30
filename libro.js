// Modelo de Libro/Ejemplar
module.exports = class Libro {
  constructor({ inventario, isbn, codigoBarra, qr, titulo, subtitulo, autores, edicion, editorial, lugar, anio, descripcionFisica, serie, materias, clasificaciones, ubicacion, estado, notas, fechaIngreso, procedencia, foto }) {
    this.inventario = inventario; // único
    this.isbn = isbn;
    this.codigoBarra = codigoBarra;
    this.qr = qr;
    this.titulo = titulo;
    this.subtitulo = subtitulo;
    this.autores = autores; // array
    this.edicion = edicion;
    this.editorial = editorial;
    this.lugar = lugar;
    this.anio = anio;
    this.descripcionFisica = descripcionFisica;
    this.serie = serie;
    this.materias = materias; // array
    this.clasificaciones = clasificaciones; // { cdd, cdu, lcc, max21, signatura }
    this.ubicacion = ubicacion; // { sala, estanteria, anaquel, posicion }
    this.estado = estado;
    this.notas = notas;
    this.fechaIngreso = fechaIngreso;
    this.procedencia = procedencia;
    this.foto = foto;
  }
}
