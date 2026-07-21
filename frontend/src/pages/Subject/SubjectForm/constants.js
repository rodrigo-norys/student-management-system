import { SUBJECT_STATUS } from '../constants';

export const INITIAL_STATE = Object.freeze({
  name: '',
  code: '',
  description: '',
  knowledge_area: '',
  is_elective: false,
  status: SUBJECT_STATUS.ACTIVE,
});
