import { EMPTY_ADDRESS } from 'constants/location.js';

export const INITIAL_STATE = Object.freeze({
  full_name: '',
  email: '',
  personal_email: '',
  cpf: '',
  phone: '',
  birth_date: '',
  hiring_date: '',
  job_title: '',
  status: 'active',
  avatar_url: '',
  addresses: [{ ...EMPTY_ADDRESS }],
});
