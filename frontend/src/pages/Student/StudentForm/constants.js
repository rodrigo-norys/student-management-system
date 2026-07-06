import { EMPTY_ADDRESS } from 'constants/location.js';

export const INITIAL_STATE = Object.freeze({
  name: '',
  last_name: '',
  email: '',
  registration_number: '',
  cpf: '',
  birth_date: '',
  avatar_url: '',
  blood_type: '',
  medical_notes: '',
  addresses: [{ ...EMPTY_ADDRESS }],
});
