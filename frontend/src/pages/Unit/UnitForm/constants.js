import { EMPTY_ADDRESS } from 'constants/location';
import { UNIT_STATUS } from '../constants';

export const INITIAL_STATE = Object.freeze({
  name: '',
  cnpj: '',
  email: '',
  phone: '',
  status: UNIT_STATUS.ACTIVE,
  address: { ...EMPTY_ADDRESS },
});
