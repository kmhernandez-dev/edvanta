import { describe, expect, it } from 'vitest';
import { createDemoVida360State, createEmptyVida360State } from '../data/vida360Demo';
import { buildTimeline, completionPercent, computeFst360 } from './vida360';

describe('FST Vida 360 domain rules', () => {
  it('does not produce a single clinical score', () => {
    const result = computeFst360(createDemoVida360State('thyroidectomy'));
    expect(result).toHaveLength(5);
    expect(result.every(item => item.status && item.reason && item.next)).toBe(true);
    expect(result.some(item => 'score' in item || 'points' in item)).toBe(false);
  });

  it('makes missing information explicit', () => {
    const result = computeFst360(createEmptyVida360State({ name: 'Paciente demo' }));
    expect(result.filter(item => item.status === 'insufficient').length).toBeGreaterThanOrEqual(3);
    expect(result.find(item => item.code === 'pharmacotherapy').missing).toContain('Medicamentos activos');
  });

  it('raises an organizational access priority without diagnosing', () => {
    const result = computeFst360(createDemoVida360State('access'));
    const access = result.find(item => item.code === 'social');
    expect(access.status).toBe('priority');
    expect(access.next).toMatch(/fechas|radicados/i);
  });

  it('orders the patient timeline from newest to oldest', () => {
    const timeline = buildTimeline(createDemoVida360State('laboratories'));
    expect(timeline.length).toBeGreaterThan(4);
    expect(String(timeline[0].date).localeCompare(String(timeline.at(-1).date))).toBeGreaterThanOrEqual(0);
  });

  it('calculates completion from useful sections only', () => {
    const empty = completionPercent(createEmptyVida360State({ name: '' }));
    const demo = completionPercent(createDemoVida360State('thyroidectomy'));
    expect(empty).toBeLessThan(demo);
    expect(demo).toBeLessThanOrEqual(100);
  });
});

