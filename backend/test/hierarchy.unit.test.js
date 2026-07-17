import { describe, it, expect } from 'vitest';

import { isProtectedTarget, hasAuthorityOver } from '../src/utils/hierarchy.js';

// Trava o contrato de falha fechada das duas helpers. "Alvo sem conta" e
// "include projetado sem access_level" chegam ambos como dado ausente; só o
// user_id cru os distingue.

const GENERAL_DIRECTOR = {
  access_level_id: 1,
  access_level: { hierarchy_weight: 100 },
};
const SCHOOL_OFFICE = {
  access_level_id: 2,
  access_level: { hierarchy_weight: 80 },
};

describe('isProtectedTarget', () => {
  it('protege o nível 1', () => {
    expect(isProtectedTarget(9001, GENERAL_DIRECTOR)).toBe(true);
  });

  it('libera os demais níveis', () => {
    expect(isProtectedTarget(9002, SCHOOL_OFFICE)).toBe(false);
  });

  it('registro sem conta vinculada não é alvo protegido', () => {
    expect(isProtectedTarget(null, null)).toBe(false);
  });

  it('FALHA FECHADA: conta existe mas o user não veio no include', () => {
    expect(isProtectedTarget(9001, null)).toBe(true);
  });

  it('FALHA FECHADA: conta existe mas a projeção derrubou access_level_id', () => {
    expect(isProtectedTarget(9001, { email: 'gd@test.local' })).toBe(true);
  });
});

describe('hasAuthorityOver', () => {
  it('paridade: peso igual desativa peso igual', () => {
    expect(hasAuthorityOver(80, 9002, SCHOOL_OFFICE)).toBe(true);
  });

  it('peso menor não alcança peso maior', () => {
    expect(hasAuthorityOver(30, 9001, GENERAL_DIRECTOR)).toBe(false);
  });

  it('registro sem conta vinculada não tem hierarquia a violar', () => {
    expect(hasAuthorityOver(80, null, null)).toBe(true);
  });

  it('FALHA FECHADA: conta existe mas o peso não veio carregado', () => {
    expect(hasAuthorityOver(100, 9001, { access_level_id: 1 })).toBe(false);
  });

  it('FALHA FECHADA: ator sem peso não alcança ninguém', () => {
    expect(hasAuthorityOver(undefined, 9002, SCHOOL_OFFICE)).toBe(false);
  });
});
