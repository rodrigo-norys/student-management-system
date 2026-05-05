export const TAB_KEYS = Object.freeze({
  GENERAL: 'general',
  ADDRESS: 'address',
  DEPENDENTS: 'dependents',
});

export const PROFILE_TABS = Object.freeze([
  { key: TAB_KEYS.GENERAL, label: 'General Info' },
  { key: TAB_KEYS.ADDRESS, label: 'Addresses' },
  { key: TAB_KEYS.DEPENDENTS, label: 'Dependents' },
]);

export const DEFAULT_TAB = TAB_KEYS.GENERAL;
