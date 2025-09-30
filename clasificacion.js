// Módulo de clasificación y signatura (demo)
function sugerirClasificacion(titulo, autor) {
  // Aquí se integraría consulta a webs de CDU, Dewey, etc.
  return `Clasificación sugerida para "${titulo}" de ${autor}: CDD 813`;
}
module.exports = { sugerirClasificacion };
