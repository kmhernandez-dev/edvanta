import { describe, expect, it } from 'vitest';
import { analyzeCv, analyzeText, adaptCv, sugerirCargo, cargarPorSlug } from '../lib/cv/analyzer';

const CV_BASE = {
  nombre: 'María Gómez',
  email: 'maria@correo.com',
  telefono: '+57 300 000 0000',
  ciudad: 'Bogotá',
  resumen: 'Química farmacéutica con 8 años de experiencia en control de calidad y aseguramiento bajo BPM, BPL y gestión de integridad de datos. Lideré auditorías a proveedores y cerré CAPA y desviaciones OOS sin recurrencia.',
  experiencia: [
    { cargo: 'Analista de control de calidad', empresa: 'Laboratorio X', logros: 'Reducí desviaciones 30% con un plan de muestreo.' },
    { cargo: 'Coordinadora QA', logros: 'Cerré 20 CAPA en plazo. Mantuve 0 hallazgos críticos en auditorías.' },
  ],
  educacion: [{ titulo: 'Química farmacéutica', institucion: 'Universidad Y', anio: '2020' }],
  habilidades: ['BPM', 'BPL', 'Excel avanzado', 'Power BI'],
  certificaciones: [{ nombre: 'Curso de BPM', institucion: 'INVIMA', anio: '2024' }],
  idiomas: [{ idioma: 'Español', nivel: 'Nativo' }],
};

describe('CV analyzer', () => {
  it('scores a complete CV as high (>=80)', () => {
    const result = analyzeCv(CV_BASE, 'analista-calidad');
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.nivel).toBe('alto');
  });

  it('detects missing sections on an empty CV', () => {
    const result = analyzeCv({ nombre: '', email: '', resumen: '', experiencia: [], educacion: [], habilidades: [] }, 'analista-calidad');
    expect(result.score).toBeLessThan(50);
    expect(result.hallazgos.some(f => f.titulo === 'Estructura y secciones' && f.tipo === 'warn')).toBe(true);
    expect(result.hallazgos.some(f => f.tipo === 'error')).toBe(true);
  });

  it('penalizes personal data forbidden by ATS', () => {
    const result = analyzeCv({ ...CV_BASE, resumen: `${CV_BASE.resumen} Fecha de nacimiento: 05/05/1990` }, 'analista-calidad');
    expect(result.hallazgos.some(f => f.titulo === 'Datos personales prohibidos' && f.tipo === 'error')).toBe(true);
  });

  it('ranks a CV with few keywords lower', () => {
    const weak = { ...CV_BASE, resumen: 'Soy química farmacéutica recién graduada con interés en la industria.', habilidades: ['Word'] };
    const strong = analyzeCv(CV_BASE, 'analista-calidad');
    const weakResult = analyzeCv(weak, 'analista-calidad');
    expect(weakResult.score).toBeLessThan(strong.score);
  });

  it('analyzeText flags missing keywords for the target role', () => {
    const result = analyzeText('Hola, tengo experiencia general en oficinas y atención al cliente.', 'analista-calidad');
    expect(result.hallazgos.some(f => f.titulo === 'Palabras clave del cargo')).toBe(true);
  });

  it('adaptCv returns suggested content for a role', () => {
    const adaptation = adaptCv(CV_BASE, 'asuntos-regulatorios');
    expect(adaptation.cargo).toBe('Analista de asuntos regulatorios');
    expect(adaptation.palabras.length).toBeGreaterThan(5);
    expect(adaptation.logrosSugeridos.length).toBeGreaterThan(0);
    expect(adaptation.secciones).toContain('Perfil profesional');
  });

  it('sugerirCargo matches the best role from text', () => {
    const slug = sugerirCargo('Registro sanitario ante INVIMA, etiquetado, dossier, renovaciones de registro');
    expect(slug).toBe('asuntos-regulatorios');
  });

  it('cargarPorSlug resolves known roles and null for unknown', () => {
    expect(cargarPorSlug('analista-calidad').cargo).toContain('Analista de calidad');
    expect(cargarPorSlug('no-existe')).toBeNull();
  });
});
