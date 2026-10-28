/**
 * Los diez diseños del catálogo tienen que generar un PDF legible:
 * secciones reconocibles, contenido real, sin errores de jsPDF y sin
 * recortar nada cuando la hoja de vida es larga.
 *
 * Regla que se conserva (docs/EDVANTA_SITIO.md): el texto de cada
 * sección sale completo y en orden de lectura, así el analizador ATS de
 * Edvanta lo lee bien.
 */
import { describe, expect, it } from 'vitest';
import { datos, generarCvPdf, nombreArchivo } from '../lib/cv/pdf';
import { esEstiloPlantilla, normalizarEstilo, PLANTILLAS } from '../lib/cv/catalogo';
import { cifrasModular } from '../lib/cv/plantillas';

const CV = {
  nombre: 'Karla María Hernández', titulo: 'Química farmacéutica', email: 'k@correo.com', telefono: '+57 300 000 0000',
  ciudad: 'Barranquilla', linkedin: 'linkedin.com/in/karla', resumen: 'Perfil de prueba con experiencia hospitalaria.',
  experiencia: [{ cargo: 'Analista de Calidad', empresa: 'Laboratorios ABC', inicio: 'Ene 2021', fin: '', logros: 'Reduje 25% el tiempo de liberación.\nValidé 4 métodos por HPLC.' }],
  educacion: [{ titulo: 'Química Farmacéutica', institucion: 'Universidad del Atlántico', anio: '2017' }],
  habilidades: ['BPM', 'HPLC', 'Validación de métodos', 'CAPA', 'Power BI'],
  certificaciones: [{ nombre: 'Buenas Prácticas de Manufactura', institucion: 'INVIMA', anio: '2023' }],
  idiomas: [{ idioma: 'Inglés', nivel: 'B2' }],
  referencias: [],
};

const largo = () => ({
  ...CV,
  experiencia: Array.from({ length: 7 }, (_, i) => ({
    cargo: `Cargo número ${i + 1}`, empresa: 'Clínica General', inicio: `Ene 20${10 + i}`, fin: `Dic 20${10 + i}`,
    logros: 'Dispensé medicamentos a 300 pacientes diarios.\nControlé el inventario de control especial.\nCapacité al personal auxiliar.',
  })),
});

describe('hoja de vida · diez diseños', () => {
  it('cada diseño genera un PDF con el nombre y las secciones en orden', async () => {
    expect(PLANTILLAS).toHaveLength(10);
    for (const p of PLANTILLAS) {
      const doc = await generarCvPdf(CV, 'Analista de calidad', p.id, { comprimir: false });
      const crudo = doc.output();
      expect(crudo, `${p.id} genera un PDF`).toContain('Karla');
      expect(crudo, `${p.id} conserva el perfil`).toContain('Perfil de prueba');
      expect(crudo, `${p.id} conserva la experiencia`).toContain('Analista de Calidad');
      expect(crudo, `${p.id} conserva los logros`).toContain('HPLC');
      expect(crudo, `${p.id} no escupe objetos`).not.toContain('[object Object]');
      expect(doc.getNumberOfPages(), `${p.id} cabe en una página`).toBe(1);
    }
  });

  it('una hoja larga sigue en otra página sin perder contenido', async () => {
    for (const p of PLANTILLAS) {
      const doc = await generarCvPdf(largo(), '', p.id, { comprimir: false });
      const crudo = doc.output();
      expect(doc.getNumberOfPages(), `${p.id} usa más de una página`).toBeGreaterThan(1);
      expect(crudo, `${p.id} no pierde el último cargo`).toContain('Cargo n');
      expect(crudo, `${p.id} conserva la formación`).toContain('Universidad del Atl');
      expect(crudo, `${p.id} numera las páginas`).toContain('de 2');
    }
  });

  it('los diseños con foto aceptan la foto de la persona', async () => {
    const foto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';
    for (const p of PLANTILLAS.filter((t) => t.foto)) {
      const doc = await generarCvPdf({ ...CV, foto }, '', p.id, { comprimir: false, foto });
      expect(doc.output(), p.id).toContain('Karla');
    }
  });

  it('las cifras del diseño modular salen de los datos, no se inventan', () => {
    const cifras = cifrasModular(datos(CV), new Date('2026-10-28'));
    expect(cifras.map((c) => c.n)).toEqual(['5 años', '1', '1']);
    expect(cifras[1].t).toBe('cargo desempeñado');
    expect(cifrasModular(datos({ nombre: 'X' }))).toEqual([]);
  });

  it('reconoce los diseños actuales y traduce los anteriores', () => {
    expect(esEstiloPlantilla('corporativo')).toBe(true);
    expect(esEstiloPlantilla('edvanta')).toBe(false);
    expect(normalizarEstilo('edvanta')).toBe('corporativo');
    expect(normalizarEstilo('pastel-serena')).toBe('moderno');
    expect(normalizarEstilo('cualquiera')).toBe('corporativo');
    expect(nombreArchivo(CV, 'Analista de calidad')).toBe('Karla-Hernandez-Analista-de-calidad.pdf');
  });
});
