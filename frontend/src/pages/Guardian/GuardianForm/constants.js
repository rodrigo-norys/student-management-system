import { EMPTY_ADDRESS } from 'constants/location.js';

export const INITIAL_STATE = Object.freeze({
  name: '',
  last_name: '',
  email: '',
  cpf: '',
  phone: '',
  avatar_url: '',
  addresses: [{ ...EMPTY_ADDRESS }]
});
