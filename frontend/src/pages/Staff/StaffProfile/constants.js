export const TAB_KEYS = Object.freeze({
  GENERAL: 'general',
  ADDRESS: 'address',
  UNITS: 'units',
  MEDICAL: 'medical',
});

export const PROFILE_TABS = Object.freeze([
  { key: TAB_KEYS.GENERAL, label: 'General Info' },
  { key: TAB_KEYS.ADDRESS, label: 'Addresses' },
  { key: TAB_KEYS.UNITS, label: 'Units' },
  { key: TAB_KEYS.MEDICAL, label: 'Medical' },
]);

export const DEFAULT_TAB = TAB_KEYS.GENERAL;

export const ASSIGNMENT_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
});

// Espelha o manage_account exigido na escrita de /staff-units: quem lê a
// lotação não necessariamente a altera.
export const ASSIGNMENT_MANAGER_LEVELS = Object.freeze([1, 2]);
