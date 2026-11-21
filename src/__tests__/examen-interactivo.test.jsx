import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ExamenInteractivo from '../components/examenes/ExamenInteractivo';
import { EXAMENES } from '../data/examenes';

describe('examen interactivo', () => {
  it('muestra las opciones, exige responder y corrige con el puntaje', () => {
    const examen = EXAMENES[0];
    render(<ExamenInteractivo examen={examen} />);

    expect(screen.getByText('Examen interactivo')).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(examen.preguntas.length * 4);

    const boton = screen.getByRole('button', { name: /Corregir examen/i });
    fireEvent.click(boton);
    expect(screen.getByRole('alert').textContent).toMatch(/Faltan 10 preguntas/);

    const radios = screen.getAllByRole('radio');
    examen.preguntas.forEach((p, i) => {
      fireEvent.click(radios[i * 4 + p.correcta]);
    });
    fireEvent.click(boton);

    expect(screen.getByText(/100 % de aciertos/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Repetir/i })).toBeTruthy();
    expect(screen.getAllByText(/Respuesta correcta:/).length).toBe(examen.preguntas.length);
  });
});
