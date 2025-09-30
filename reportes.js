// Módulo de reportes (demo)
const db = require('../db/database');
const PDFDocument = require('pdfkit');
const fs = require('fs');

function prestamosPorPeriodo() {
  return db.prepare('SELECT * FROM prestamos').all();
}
function librosMasPrestados() {
  // Demo: solo listado
  return db.prepare('SELECT titulo, COUNT(*) as veces FROM libros GROUP BY titulo ORDER BY veces DESC LIMIT 10').all();
}
function usuariosActivos() {
  return db.prepare('SELECT * FROM usuarios WHERE estado = "activo"').all();
}
function generarReportePDF(datos, nombreArchivo) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(nombreArchivo));
  doc.fontSize(18).text('Reporte SebaBiblio', { align: 'center' });
  doc.moveDown();
  datos.forEach((item, i) => {
    doc.fontSize(12).text(`${i + 1}. ${JSON.stringify(item)}`);
  });
  doc.end();
  return nombreArchivo;
}

module.exports = { prestamosPorPeriodo, librosMasPrestados, usuariosActivos, generarReportePDF };
