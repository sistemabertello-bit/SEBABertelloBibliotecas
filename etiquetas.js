// Módulo de etiquetas y códigos de barras (demo)
function generarEtiqueta(inventario, ubicacion, signatura) {
  return `Etiqueta: ${inventario} | ${ubicacion} | ${signatura}`;
}
module.exports = { generarEtiqueta };
