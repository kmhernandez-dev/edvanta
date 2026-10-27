import { describe, expect, it } from 'vitest';
import { isInternalPath, safeNextPath } from '../lib/authRedirect';

describe('vuelta segura después de entrar', () => {
  it('acepta rutas internas y conserva la página que se quería usar', () => {
    expect(safeNextPath('/academia/retos/pilates-princess')).toBe('/academia/retos/pilates-princess');
    expect(safeNextPath('/fst-app/nutrifst?goal=energia')).toBe('/fst-app/nutrifst?goal=energia');
    expect(safeNextPath('/app/perfil?bienvenida=1')).toBe('/app/perfil?bienvenida=1');
  });

  it('no permite salir del sitio', () => {
    expect(isInternalPath('https://evil.example')).toBe(false);
    expect(isInternalPath('//evil.example')).toBe(false);
    expect(isInternalPath('/\\evil.example')).toBe(false);
    expect(safeNextPath('//evil.example', '/aula')).toBe('/aula');
  });

  it('no vuelve a las pantallas de acceso para evitar bucles', () => {
    expect(safeNextPath('/cuenta', '/aula')).toBe('/aula');
    expect(safeNextPath('/cuenta?next=%2Fcurso%2Fx', '/aula')).toBe('/aula');
    expect(safeNextPath('/app', '/aula')).toBe('/aula');
    expect(safeNextPath('/app/onboarding', '/aula')).toBe('/aula');
    expect(safeNextPath('/diagnostico', '/aula')).toBe('/aula');
  });
});
