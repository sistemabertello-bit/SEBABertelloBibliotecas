// Módulo de gestión de libros
const db = require('../db/database');
const fs = require('fs');
const path = require('path');

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

// Funciones base para nuevos botones
function autocompletarISBN(isbn) {
  // Aquí se integraría consulta a OpenLibrary, Google Books, etc.
  return { titulo: 'Demo Título', autor: 'Demo Autor', editorial: 'Demo Editorial' };
}

function buscarPorCodigoBarra(codigo) {
  // Buscar libro por código de barras
  return db.prepare('SELECT * FROM libros WHERE codigoBarra = ?').get(codigo);
}

function generarCodigoBarra(inventario) {
  // Generar código de barras demo
  return 'CB-' + inventario;
}

function acomodarLibro(inventario, estanteria, anaquel, posicion) {
  // Actualizar ubicación física
  db.prepare('UPDATE libros SET estanteria = ?, anaquel = ?, posicion = ? WHERE inventario = ?')
    .run(estanteria, anaquel, posicion, inventario);
  return `E${estanteria}-A${anaquel}-P${posicion}`;
}

function importarLibros(archivo) {
  // Importa desde CSV, MARC, Aguapey, etc. Adaptable a nuevos campos
  const ext = path.extname(archivo).toLowerCase();
  let libros = [];
  if (ext === '.csv') {
    const data = fs.readFileSync(archivo, 'utf8');
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      if (row.length < 2) continue;
      let libro = {};
      headers.forEach((h, idx) => {
        libro[h.trim()] = row[idx]?.trim();
      });
      // Adaptar campos MARC/Aguapey
      libro.autores = libro['100'] ? [libro['100']] : [];
      if (libro['700']) libro.autores.push(libro['700']);
      libro.titulo = libro['245'] || libro['titulo'] || '';
      libro.subtitulo = libro['245_sub'] || '';
      libro.edicion = libro['250'] || '';
      libro.editorial = libro['260_editorial'] || libro['editorial'] || '';
      libro.lugar = libro['260_lugar'] || '';
      libro.anio = libro['260_fecha'] || libro['anio'] || '';
      libro.isbn = libro['020'] || '';
      libro.descripcionFisica = libro['300'] || '';
      libro.serie = libro['440'] || '';
      libro.materias = [];
      if (libro['650']) libro.materias.push(libro['650']);
      if (libro['653']) libro.materias.push(libro['653']);
      libro.nivel = libro['521'] || '';
      libro.soporte = libro['530'] || '';
      libro.notas = libro['500'] || '';
      libro.inventario = libro['inventario'] || libro['001'] || '';
      // Otros campos MARC
      // ...
      libros.push(libro);
      agregarLibro(libro);
    }
  }
  // Adaptable: si hay nuevos campos, se agregan automáticamente
  return `Importados ${libros.length} libros desde: ${archivo}`;
}

function exportarLibros(destino) {
  // Exporta todos los libros a CSV
  const libros = listarLibros();
  if (!libros.length) return 'No hay libros para exportar.';
  const headers = Object.keys(libros[0]);
  const lines = [headers.join(',')];
  libros.forEach(libro => {
    lines.push(headers.map(h => JSON.stringify(libro[h] || '')).join(','));
  });
  fs.writeFileSync(destino, lines.join('\n'), 'utf8');
  return `Exportados ${libros.length} libros a: ${destino}`;
}

function generarCodigoBarraLibro() {
  const inventario = document.querySelector('input[name="inventario"]').value;
  if (!inventario) return alert('Ingrese el número de inventario');
  const codigoBarraImg = require('../etiquetas').generarCodigoBarra(inventario);
  const visual = document.getElementById('codigoBarraVisual');
  if (visual) {
    visual.innerHTML = `<img src='${codigoBarraImg}' style='height:40px;margin-left:8px;vertical-align:middle;'>`;
  }
}

function agregarUbicacionLibro() {
  const inventario = document.querySelector('input[name="inventario"]').value;
  const estanteria = document.querySelector('input[name="estanteria"]').value;
  const anaquel = document.querySelector('input[name="anaquel"]').value;
  const posicion = document.querySelector('input[name="posicion"]').value;
  if (!inventario || !estanteria || !anaquel || !posicion) return alert('Complete todos los campos de ubicación');
  require('../libros').acomodarLibro(inventario, estanteria, anaquel, posicion);
  alert('Ubicación actualizada');
}

function mostrarFichaLibro() {
  const inventario = document.querySelector('input[name="inventario"]').value;
  if (!inventario) return alert('Ingrese el número de inventario');
  const libro = require('../libros').buscarLibroPorInventario(inventario);
  if (!libro) return alert('No se encontró el libro');
  let ficha = '<h3>Ficha completa del libro</h3><table border="1" style="width:100%;">';
  Object.keys(libro).forEach(k => {
    ficha += `<tr><td><b>${k}</b></td><td>${typeof libro[k] === 'object' ? JSON.stringify(libro[k]) : libro[k]}</td></tr>`;
  });
  ficha += '</table>';
  const dialog = document.getElementById('pdfDialog');
  dialog.innerHTML = ficha + '<button onclick="this.parentNode.style.display=\'none\'">Cerrar</button>';
  dialog.style.display = 'block';
}

module.exports = {
  agregarLibro,
  buscarLibroPorInventario,
  listarLibros,
  autocompletarISBN,
  buscarPorCodigoBarra,
  generarCodigoBarra,
  acomodarLibro,
  importarLibros,
  exportarLibros,
  generarCodigoBarraLibro,
  agregarUbicacionLibro,
  mostrarFichaLibro
};
