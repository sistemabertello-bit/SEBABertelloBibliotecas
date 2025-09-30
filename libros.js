// Módulo de gestión de libros
const db = require('../db/database');

function agregarLibro(libro) {
  const stmt = db.prepare(`INSERT INTO libros (
    inventario, isbn, codigoBarra, qr, titulo, subtitulo, autores, edicion, editorial, lugar, anio, descripcionFisica, serie, materias, clasificaciones, sala, estanteria, anaquel, posicion, estado, notas, fechaIngreso, procedencia, foto
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(
    libro.inventario, libro.isbn, libro.codigoBarra, libro.qr, libro.titulo, libro.subtitulo, JSON.stringify(libro.autores), libro.edicion, libro.editorial, libro.lugar, libro.anio, libro.descripcionFisica, libro.serie, JSON.stringify(libro.materias), JSON.stringify(libro.clasificaciones), libro.ubicacion.sala, libro.ubicacion.estanteria, libro.ubicacion.anaquel, libro.ubicacion.posicion, libro.estado, libro.notas, libro.fechaIngreso, libro.procedencia, libro.foto
  );
}

function buscarLibroPorInventario(inventario) {
  return db.prepare('SELECT * FROM libros WHERE inventario = ?').get(inventario);
}

function listarLibros() {
  return db.prepare('SELECT * FROM libros').all();
}

module.exports = { agregarLibro, buscarLibroPorInventario, listarLibros };
