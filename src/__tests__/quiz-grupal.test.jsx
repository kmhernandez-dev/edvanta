import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QuizGrupal from '../components/examenes/QuizGrupal';
import { EXAMENES } from '../data/examenes';

afterEach(cleanup);

const examen = EXAMENES[0];

describe('quiz grupal', () => {
  it('configura equipos, responde una pregunta y suma puntos', () => {
    render(<QuizGrupal examen={examen} />);

    expect(screen.getByText(/Practiquen juntos, por turnos/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Comenzar quiz en grupos/i }));

    const enunciado = screen.getByRole('heading', { level: 3 }).textContent;
    const pregunta = examen.preguntas.find((p) => p.enunciado === enunciado);
    expect(pregunta).toBeTruthy();

    const opcionCorrecta = screen.getByText(pregunta.opciones[pregunta.correcta]);
    fireEvent.click(opcionCorrecta.closest('button'));

    expect(screen.getByText(/suma 10 puntos/i)).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText(/Respuesta correcta:/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Siguiente pregunta/i }));
    expect(screen.getByText(/Turno de Equipo 2/i)).toBeTruthy();
  });

  it('permite crear cuatro equipos con nombres propios', () => {
    render(<QuizGrupal examen={examen} />);

    fireEvent.click(screen.getByRole('button', { name: /4 equipos/i }));
    expect(screen.getAllByRole('textbox')).toHaveLength(4);

    const nombres = screen.getAllByRole('textbox');
    fireEvent.change(nombres[0], { target: { value: 'Farmacia clínica' } });
    fireEvent.change(nombres[3], { target: { value: 'Atención farmacéutica' } });

    expect(screen.getByDisplayValue('Farmacia clínica')).toBeTruthy();
    expect(screen.getByDisplayValue('Atención farmacéutica')).toBeTruthy();
  });
});
