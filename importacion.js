const { importarLibros, exportarLibros } = require('./libros');

function importarDesdeAguapey(archivo) {
  return importarLibros(archivo);
}
function exportarAguapey(destino) {
  return exportarLibros(destino);
}
module.exports = { importarDesdeAguapey, exportarAguapey };
