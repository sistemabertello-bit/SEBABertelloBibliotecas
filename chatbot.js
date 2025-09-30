const { listarLibros } = require('./libros');
const { listarUsuarios } = require('./usuarios');
const { listarPrestamos } = require('./prestamos');

function buscarEnBases(query) {
  const libros = listarLibros().filter(l => JSON.stringify(l).toLowerCase().includes(query.toLowerCase()));
  const usuarios = listarUsuarios().filter(u => JSON.stringify(u).toLowerCase().includes(query.toLowerCase()));
  const prestamos = listarPrestamos().filter(p => JSON.stringify(p).toLowerCase().includes(query.toLowerCase()));
  return { libros, usuarios, prestamos };
}

function sugerenciasBibliotecario(query) {
  // Ejemplo: sugerir libros por materia, autor, nivel
  const libros = listarLibros();
  let sugeridos = libros.filter(l => l.materias && l.materias.some(m => m.toLowerCase().includes(query.toLowerCase())));
  if (sugeridos.length === 0) {
    sugeridos = libros.filter(l => l.autores && l.autores.some(a => a.toLowerCase().includes(query.toLowerCase())));
  }
  return sugeridos.slice(0, 5);
}

function sugerenciasPedagogico(query) {
  // Ejemplo: sugerir libros por nivel educativo
  const libros = listarLibros();
  return libros.filter(l => l.nivel && l.nivel.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
}

async function responderIA(pregunta) {
  const bases = buscarEnBases(pregunta);
  const sugerenciasBiblio = sugerenciasBibliotecario(pregunta);
  const sugerenciasPed = sugerenciasPedagogico(pregunta);
  let respuestaIA = '';
  try {
    // Llama 3 API pública (ejemplo, adaptar endpoint real)
    const res = await fetch('https://api.llama3.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: pregunta }], model: 'llama-3-8b' })
    });
    const data = await res.json();
    respuestaIA = data.choices?.[0]?.message?.content || '';
  } catch (e) {
    respuestaIA = 'No se pudo obtener respuesta de IA externa.';
  }
  return {
    respuesta: `Resultados encontrados para: ${pregunta}`,
    respuestaIA,
    libros: bases.libros,
    usuarios: bases.usuarios,
    prestamos: bases.prestamos,
    sugerenciasBibliotecario: sugerenciasBiblio,
    sugerenciasPedagogico: sugerenciasPed
  };
}

module.exports = { responderIA, buscarEnBases, sugerenciasBibliotecario, sugerenciasPedagogico };
