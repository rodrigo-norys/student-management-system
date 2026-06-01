export const TAB_KEYS = Object.freeze({
  GENERAL: 'general',
  ADDRESS: 'address',
  MEDICAL: 'medical',
  GUARDIANS: 'guardians',
});

export const PROFILE_TABS = Object.freeze([
  { key: TAB_KEYS.GENERAL, label: 'General Info' },
  { key: TAB_KEYS.ADDRESS, label: 'Addresses' },
  { key: TAB_KEYS.MEDICAL, label: 'Medical' },
  { key: TAB_KEYS.GUARDIANS, label: 'Guardians' },
]);

export const DEFAULT_TAB = TAB_KEYS.GENERAL;
