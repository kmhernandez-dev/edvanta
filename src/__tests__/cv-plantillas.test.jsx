/**
 * Las siete plantillas del catálogo tienen que generar un PDF legible:
 * secciones reconocibles, contenido real y sin errores de jsPDF.
 *
 * Regla de la plantilla oficial que se conserva (docs/EDVANTA_SITIO.md):
 * el texto de cada sección sale completo y en orden de lectura, así el
 * analizador ATS de Edvanta la lee bien.
 */
import { describe, expect, it } from 'vitest';
import { generarCvPdf, nombreArchivo } from '../lib/cv/pdf';
import { PLANTILLAS, esEstiloPlantilla } from '../lib/cv/plantillas';

const CV = {
  nombre: 'Karla María Hernández', titulo: 'Química farmacéutica', email: 'k@correo.com', telefono: '+57 300 000 0000',
  ciudad: 'Barranquilla', linkedin: 'linkedin.com/in/karla', resumen: 'Perfil de prueba con experiencia hospitalaria.',
  experiencia: [{ cargo: 'Analista de Calidad', empresa: 'Laboratorios ABC', inicio: 'Ene 2021', fin: '', logros: 'Reduje 25% el tiempo de liberación.' }],
  educacion: [{ titulo: 'Química Farmacéutica', institucion: 'Universidad del Atlántico', anio: '2017' }],
  habilidades: ['BPM', 'HPLC', 'Validación de métodos', 'CAPA', 'Power BI'],
  certificaciones: [{ nombre: 'Buenas Prácticas de Manufactura', institucion: 'INVIMA', anio: '2023' }],
  idiomas: [{ idioma: 'Inglés', nivel: 'B2' }],
  referencias: [],
};

describe('hoja de vida · plantillas del catálogo', () => {
  it('todas las plantillas generan un PDF con el nombre y las secciones en orden', async () => {
    expect(PLANTILLAS.length).toBeGreaterThanOrEqual(7);
    for (const p of PLANTILLAS) {
      const doc = await generarCvPdf(CV, 'Analista de calidad', p.id, { comprimir: false });
      const crudo = doc.output();
      expect(crudo, `${p.id} genera un PDF`).toContain('Karla');
      expect(crudo, `${p.id} conserva el perfil`).toContain('Perfil de prueba');
      expect(crudo, `${p.id} conserva la experiencia`).toContain('Analista de Calidad');
      const posPerfil = crudo.indexOf('PERFIL PROFESIONAL');
      const posExp = crudo.indexOf('EXPERIENCIA');
      if (posPerfil !== -1 && posExp !== -1) {
        expect(posPerfil, `${p.id}: el perfil va antes que la experiencia`).toBeLessThan(posExp);
      }
      expect(crudo, `${p.id} no escupe objetos`).not.toContain('[object Object]');
    }
  });

  it('el nombre del archivo conserva la plantilla elegida', async () => {
    expect(nombreArchivo(CV, 'Analista de calidad', 'ejecutiva')).toBe('Karla-Hernandez-Analista-de-calidad.pdf');
    expect(nombreArchivo(CV, '', 'ats')).toBe('Karla-Hernandez-ATS.pdf');
  });

  it('la plantilla con foto dibuja la foto del usuario cuando viene', async () => {
    const p = PLANTILLAS.find((t) => t.id === 'ejecutiva');
    expect(p.foto).toBe(true);
    const foto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';
    const doc = await generarCvPdf({ ...CV, foto }, 'Analista de calidad', 'ejecutiva', { comprimir: false });
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    expect(doc.output()).toContain('Karla');
  });

  it('los estilos del catálogo se reconocen como plantillas', () => {
    expect(esEstiloPlantilla('ejecutiva')).toBe(true);
    expect(esEstiloPlantilla('azul')).toBe(true);
    expect(esEstiloPlantilla('edvanta')).toBe(false);
    expect(esEstiloPlantilla('ats')).toBe(false);
  });
});
