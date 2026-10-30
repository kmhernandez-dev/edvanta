/**
 * El certificado de aprobación en el sitio: lo que dice y cómo se ve.
 */
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/certificado/qr', () => ({ qrDe: () => Promise.resolve('data:image/png;base64,AAAA') }));

/* eslint-disable import/first */
import Diploma from '../components/edvanta/Diploma';
import {
  enlaceDeLinkedin, fechaLarga, lineaDeExpedicion, lineaDeIntensidad, textoDeHoras, urlDeVerificacion,
} from '../lib/certificado/formato';
/* eslint-enable import/first */

afterEach(cleanup);

describe('certificado · lo que dice', () => {
  it('horas, intensidad y fecha en español', () => {
    expect(textoDeHoras(20)).toBe('20 horas');
    expect(textoDeHoras(2.5)).toBe('2,5 horas');
    expect(textoDeHoras(1)).toBe('1 hora');
    expect(textoDeHoras(null)).toBeNull();
    expect(lineaDeIntensidad({ horas: 20, modalidad: 'Virtual' })).toBe('Con una intensidad de 20 horas · Modalidad virtual');
    // Sin horas declaradas no se inventan: solo la modalidad.
    expect(lineaDeIntensidad({ horas: null, modalidad: 'Virtual' })).toBe('Modalidad virtual');
    expect(fechaLarga('2026-10-29T15:00:00Z')).toBe('29 de octubre de 2026');
    expect(lineaDeExpedicion({ fecha: '2026-10-29T15:00:00Z' })).toBe('Expedido en Medellín, el 29 de octubre de 2026.');
  });

  it('la verificación y LinkedIn llevan el código', () => {
    expect(urlDeVerificacion('EDV-7K3P-9QXM')).toBe('https://edvanta.co/certificados/EDV-7K3P-9QXM');
    const l = new URL(enlaceDeLinkedin({ curso: 'Curso de BPM', codigo: 'EDV-7K3P-9QXM', fecha: '2026-10-29T15:00:00Z' }));
    expect(l.hostname).toBe('www.linkedin.com');
    expect(l.searchParams.get('certId')).toBe('EDV-7K3P-9QXM');
    expect(l.searchParams.get('certUrl')).toBe('https://edvanta.co/certificados/EDV-7K3P-9QXM');
    expect(l.searchParams.get('name')).toBe('Curso de BPM');
  });
});

describe('certificado · el diploma', () => {
  it('la muestra de la ficha no lleva el nombre de nadie', () => {
    render(<Diploma muestra curso="Curso de Farmacoterapia de la Diabetes" horas={20} />);
    expect(screen.getByText('Tu nombre')).toBeTruthy();
    expect(screen.getByText('Muestra')).toBeTruthy();
    expect(screen.getByText('Código: EDV-XXXX-XXXX')).toBeTruthy();
    expect(screen.getByText('Curso de Farmacoterapia de la Diabetes')).toBeTruthy();
    expect(screen.getByText('Con una intensidad de 20 horas · Modalidad virtual')).toBeTruthy();
    expect(screen.getByText('NIT: 902.120.527-6')).toBeTruthy();
  });

  it('el emitido lleva el titular, su documento y su código', () => {
    render(<Diploma titular="Ana María Restrepo" documento="1.045.876.876" curso="Curso de BPM" horas={null} fecha="2026-10-29T15:00:00Z" codigo="EDV-7K3P-9QXM" />);
    expect(screen.getByText('Ana María Restrepo')).toBeTruthy();
    expect(screen.getByText('Documento de identidad: 1.045.876.876')).toBeTruthy();
    expect(screen.getByText('Código: EDV-7K3P-9QXM')).toBeTruthy();
    expect(screen.getByText('Modalidad virtual')).toBeTruthy();
    expect(screen.queryByText('Muestra')).toBeNull();
    expect(screen.getByAltText('Firma de Karla H.')).toBeTruthy();
  });
});
