// Conexión y utilidades para SQLite
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'biblioteca.db');
const db = new Database(dbPath);

// Crear tablas si no existen
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS libros (
      inventario TEXT PRIMARY KEY,
      isbn TEXT,
      codigoBarra TEXT,
      qr TEXT,
      titulo TEXT,
      subtitulo TEXT,
      autores TEXT,
      edicion TEXT,
      editorial TEXT,
      lugar TEXT,
      anio TEXT,
      descripcionFisica TEXT,
      serie TEXT,
      materias TEXT,
      clasificaciones TEXT,
      sala TEXT,
      estanteria TEXT,
      anaquel TEXT,
      posicion TEXT,
      estado TEXT,
      notas TEXT,
      fechaIngreso TEXT,
      procedencia TEXT,
      foto TEXT
    );
    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      dni TEXT,
      nombre TEXT,
      apellido TEXT,
      tipo TEXT,
      email TEXT,
      whatsapp TEXT,
      direccion TEXT,
      foto TEXT,
      estado TEXT,
      fechaAlta TEXT,
      historial TEXT
    );
    CREATE TABLE IF NOT EXISTS prestamos (
      id TEXT PRIMARY KEY,
      socioId TEXT,
      inventario TEXT,
      fechaPrestamo TEXT,
      fechaDevolucionPrevista TEXT,
      fechaDevolucionReal TEXT,
      estado TEXT,
      notas TEXT,
      excepciones TEXT
    );
    CREATE TABLE IF NOT EXISTS auditoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT,
      accion TEXT,
      fecha TEXT,
      modulo TEXT,
      detalles TEXT
    );
  `);
}

initDB();

module.exports = db;
