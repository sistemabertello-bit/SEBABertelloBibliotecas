// Búsqueda manual por teclado
function buscarLibrosManual() {
  const query = document.getElementById('busquedaInput').value.trim();
  if (!query) return;
  if (window.api) {
    window.api.send('exportar-libros').then(res => {
      if (res.success && res.datos) {
        const resultados = res.datos.filter(libro =>
          (libro.titulo && libro.titulo.toLowerCase().includes(query.toLowerCase())) ||
          (libro.inventario && libro.inventario.toString().includes(query)) ||
          (libro.autores && libro.autores.toLowerCase().includes(query.toLowerCase()))
        );
        mostrarResultadosBusqueda(resultados);
      }
    });
  }
}

// Búsqueda por código de barras (pistola lectora o cámara)
function buscarPorCodigoBarra() {
  const codigo = prompt('Escanee el código de barras o ingréselo manualmente:');
  if (!codigo) return;
  if (window.api) {
    window.api.send('buscar-por-codigo-barra', { codigo }).then(res => {
      if (res && res.titulo) {
        mostrarResultadosBusqueda([res]);
      } else {
        alert('No se encontró libro con ese código');
      }
    });
  }
}

// Búsqueda real por cámara usando Quagga
function buscarPorCamara() {
  const dialog = document.getElementById('camaraDialog');
  dialog.style.display = 'block';
  document.getElementById('resultadoCamara').innerText = 'Escaneando...';
  // Cargar Quagga si no está
  if (!window.Quagga) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/quagga@0.12.1/dist/quagga.min.js';
    script.onload = iniciarQuagga;
    document.body.appendChild(script);
  } else {
    iniciarQuagga();
  }
}

function iniciarQuagga() {
  window.Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: document.querySelector('#videoCamara'),
      constraints: {
        width: 400,
        height: 200,
        facingMode: 'environment'
      }
    },
    decoder: {
      readers: ['code_128_reader', 'ean_reader', 'ean_8_reader']
    }
  }, function(err) {
    if (err) {
      document.getElementById('resultadoCamara').innerText = 'Error: ' + err;
      return;
    }
    window.Quagga.start();
  });
  window.Quagga.onDetected(function(result) {
    const codigo = result.codeResult.code;
    document.getElementById('resultadoCamara').innerText = 'Código detectado: ' + codigo;
    window.Quagga.stop();
    // Buscar libro por código detectado
    if (window.api) {
      window.api.send('buscar-por-codigo-barra', { codigo }).then(res => {
        if (res && res.titulo) {
          mostrarResultadosBusqueda([res]);
        } else {
          alert('No se encontró libro con ese código');
        }
      });
    }
  });
}

function cerrarCamara() {
  const dialog = document.getElementById('camaraDialog');
  dialog.style.display = 'none';
  if (window.Quagga) {
    window.Quagga.stop();
  }
}

// Mostrar resultados de búsqueda
function mostrarResultadosBusqueda(libros) {
  const ul = document.getElementById('listaLibros');
  ul.innerHTML = '';
  libros.forEach(libro => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${libro.titulo}</b> [Inventario: ${libro.inventario}] <button onclick='imprimirCodigoBarraIndividual("${libro.inventario}")'>Imprimir código</button>`;
    ul.appendChild(li);
  });
}
// Cargar lista de libros con selección para imprimir códigos de barra
function cargarListaLibros() {
  if (window.api) {
    window.api.send('exportar-libros').then(res => {
      if (res.success && res.datos) {
        const ul = document.getElementById('listaLibros');
        ul.innerHTML = '';
        res.datos.forEach(libro => {
          const li = document.createElement('li');
          li.innerHTML = `<input type='checkbox' class='cb-libro' value='${libro.inventario}'> <b>${libro.titulo}</b> [Inventario: ${libro.inventario}] <button onclick='imprimirCodigoBarraIndividual("${libro.inventario}")'>Imprimir código</button>`;
          ul.appendChild(li);
        });
      }
    });
  }
}

// Imprimir código de barra individual
function imprimirCodigoBarraIndividual(inventario) {
  if (window.api) {
    window.api.send('codigo-barra-libro', { inventario }).then(res => {
      if (res.success) {
        mostrarPDF([res.codigo], `Código de barra libro ${inventario}`);
      }
    });
  }
}

// Imprimir códigos de barra seleccionados (por lote)
function imprimirCodigosBarraSeleccionados() {
  const checks = document.querySelectorAll('.cb-libro:checked');
  const inventarios = Array.from(checks).map(cb => cb.value);
  if (inventarios.length === 0) {
    alert('Selecciona al menos un libro');
    return;
  }
  if (window.api) {
    Promise.all(inventarios.map(inv => window.api.send('codigo-barra-libro', { inventario: inv }))).then(resultados => {
      const codigos = resultados.map(r => r.codigo);
      mostrarPDF(codigos, 'Códigos de barra libros seleccionados');
    });
  }
}

// Mostrar PDF simulado en pantalla (demo)
function mostrarPDF(codigos, titulo) {
  const dialog = document.getElementById('pdfDialog');
  dialog.style.display = 'block';
  dialog.innerHTML = `<h3>${titulo}</h3><button onclick='cerrarPDF()'>Cerrar</button><div style='background:#fff;padding:10px;'>${codigos.map(c => `<div style='margin:10px;padding:10px;border:1px solid #333;font-size:20px;'>${c}<br><img src='https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(c)}&code=Code128&dpi=96' alt='barcode'></div>`).join('')}</div>`;
}

function cerrarPDF() {
  document.getElementById('pdfDialog').style.display = 'none';
}
// Funciones JS para los nuevos botones en libros.html
function autocompletarISBN() {
  const isbn = document.getElementById('isbnInput').value;
  // Simulación: en producción, llamar a backend/API
  const datos = window.api ? window.api.send('autocompletar-isbn', { isbn }) : { titulo: 'Demo Título', autor: 'Demo Autor', editorial: 'Demo Editorial' };
  if (datos) {
    document.querySelector('input[name="titulo"]').value = datos.titulo || '';
    document.querySelector('input[name="autor"]').value = datos.autor || '';
    // ...otros campos
    alert('Datos autocompletados (demo)');
  }
}

function buscarPorCodigoBarra() {
  const codigo = document.getElementById('codigoBarraInput').value;
  // Simulación: en producción, llamar a backend/API
  alert('Buscar por código de barras: ' + codigo);
}

function generarCodigoBarra() {
  const inventario = document.querySelector('input[name="inventario"]').value;
  // Simulación: en producción, llamar a backend/API
  alert('Código de barras generado: CB-' + inventario);
}

function acomodarLibro() {
  const inventario = document.querySelector('input[name="inventario"]').value;
  const estanteria = prompt('Estantería:');
  const anaquel = prompt('Anaquel:');
  const posicion = prompt('Posición:');
  if (window.api) {
    window.api.send('acomodar-libro', { inventario, estanteria, anaquel, posicion }).then(res => {
      alert('Libro acomodado en ' + res.ubicacion);
    });
  } else {
    alert(`Libro acomodado en E${estanteria}-A${anaquel}-P${posicion}`);
  }
}
// Generar código de barras y etiqueta para libro
function generarCodigoBarraLibro() {
  const inventario = document.querySelector('input[name="inventario"]').value;
  if (window.api) {
    window.api.send('codigo-barra-libro', { inventario }).then(res => {
      alert('Código de barras: ' + res.codigo);
    });
  } else {
    alert('Código de barras: CB-' + inventario);
  }
}

function generarEtiquetaLibro() {
  const inventario = document.querySelector('input[name="inventario"]').value;
  if (window.api) {
    window.api.send('etiqueta-libro', { inventario }).then(res => {
      if (res.success) {
        alert('Etiqueta: ' + res.etiqueta);
      } else {
        alert('No se encontró el libro');
      }
    });
  } else {
    alert('Etiqueta demo: ' + inventario);
  }
}

// Generar código de barras para usuario
function generarCodigoBarraUsuario() {
  const dni = prompt('DNI del usuario:');
  if (window.api) {
    window.api.send('codigo-barra-usuario', { dni }).then(res => {
      alert('Código de barras usuario: ' + res.codigo);
    });
  } else {
    alert('Código de barras usuario: CB-U-' + dni);
  }
}

function importarLibros() {
  const dialog = document.getElementById('importacionDialog');
  dialog.style.display = 'block';
  dialog.innerHTML = `<h3>Importar Libros</h3>
    <input type='file' id='archivoImportar'>
    <button onclick='procesarImportacion()'>Procesar</button>
    <button onclick='cerrarImportacion()'>Cancelar</button>
    <button onclick='exportarLibros()'>Exportar Libros</button>`;
}

function procesarImportacion() {
  const archivo = document.getElementById('archivoImportar').files[0];
  if (!archivo) {
    alert('Ningún archivo seleccionado');
    return;
  }
  // En producción: enviar archivo al backend
  if (window.api) {
    window.api.send('importar-libros', { archivo: archivo.name }).then(res => {
      alert('Resultado importación: ' + (res.resultado || 'OK'));
      cerrarImportacion();
    });
  } else {
    alert('Importación simulada: ' + archivo.name);
    cerrarImportacion();
  }
}
function exportarLibros() {
  if (window.api) {
    window.api.send('exportar-libros').then(res => {
      if (res.success && res.datos) {
        // Mostrar datos exportados (demo)
        const dialog = document.getElementById('importacionDialog');
        dialog.innerHTML += `<pre style='max-height:200px;overflow:auto;'>${JSON.stringify(res.datos, null, 2)}</pre>`;
      } else {
        alert('Error al exportar libros');
      }
    });
  } else {
    alert('Exportación simulada');
  }
}

function cerrarImportacion() {
  document.getElementById('importacionDialog').style.display = 'none';
}
