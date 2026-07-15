import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Guardrail estrutural dos 2 bugs corrigidos em F1. Não sobe app nem banco:
// lê a fonte e prova que os padrões defeituosos não voltaram.
const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, '..', 'src');

const routeFiles = [
  'staffRoutes.js',
  'guardianRoutes.js',
  'avatarRoutes.js',
].map((f) => resolve(srcDir, 'routes', f));
const controllerFiles = [
  'StaffController.js',
  'GuardianController.js',
  'AvatarController.js',
].map((f) => resolve(srcDir, 'controllers', f));

describe('regressão F1 — roleAuth por flag (nunca id numérico)', () => {
  it.each(routeFiles)('%s não chama roleAuth com número/array', (file) => {
    const src = readFileSync(file, 'utf8');
    // barra roleAuth(1, roleAuth([1, roleAuth( [ 2,3 ] ) etc.
    expect(src).not.toMatch(/roleAuth\(\s*\[?\s*\d/);
  });
});

describe('regressão F1 — req.userLevel morto removido', () => {
  it.each(controllerFiles)('%s não referencia req.userLevel', (file) => {
    const src = readFileSync(file, 'utf8');
    expect(src).not.toMatch(/req\.userLevel/);
  });
});

// Convenção: loginRequired é montado uma vez via router.use, não repetido inline
// por rota. Inline, uma rota futura adicionada sem a linha nasce sem autenticação.
describe('convenção — loginRequired via router.use', () => {
  const guardedRouteFiles = [
    'staffRoutes.js',
    'guardianRoutes.js',
    'studentRoutes.js',
    'avatarRoutes.js',
    'userRoutes.js',
  ].map((f) => resolve(srcDir, 'routes', f));

  it.each(guardedRouteFiles)(
    '%s aplica loginRequired via router.use',
    (file) => {
      const src = readFileSync(file, 'utf8');
      expect(src).toMatch(/router\.use\(loginRequired\)/);
    },
  );
});
