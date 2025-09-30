const { agregarLibro, buscarLibroPorInventario, listarLibros } = require('./libros');
const db = require('../db/database');

describe('Módulo Libros', () => {
  beforeAll(() => {
    db.prepare('DELETE FROM libros').run();
  });

  test('agregarLibro y buscarLibroPorInventario', () => {
    const libro = {
      inventario: 'TEST123',
      isbn: '9781234567890',
      codigoBarra: 'CB123',
      qr: 'QR123',
      titulo: 'Libro Test',
      subtitulo: '',
      autores: ['Autor Uno'],
      edicion: '1',
      editorial: 'Editorial Test',
      lugar: 'Ciudad',
      anio: '2025',
      descripcionFisica: '',
      serie: '',
      materias: ['Materia'],
      clasificaciones: { cdd: '813' },
      ubicacion: { sala: 'A', estanteria: '1', anaquel: '2', posicion: '3' },
      estado: 'activo',
      notas: '',
      fechaIngreso: '2025-09-27',
      procedencia: 'Donación',
      foto: ''
    };
    agregarLibro(libro);
    const encontrado = buscarLibroPorInventario('TEST123');
    expect(encontrado.titulo).toBe('Libro Test');
  });

  test('listarLibros', () => {
    const lista = listarLibros();
    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBeGreaterThan(0);
  });
});
