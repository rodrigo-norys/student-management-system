export const UNIT_CLASS_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
});

export const UNIT_CLASS_STATUS_OPTIONS = Object.freeze(
  Object.values(UNIT_CLASS_STATUS),
);

export const SHIFTS = Object.freeze(['morning', 'afternoon', 'night']);

// Espelha o piso de peso do backend: quem lê a turma não necessariamente a
// gerencia.
export const CLASS_MANAGER_LEVELS = Object.freeze([1, 2, 4]);
