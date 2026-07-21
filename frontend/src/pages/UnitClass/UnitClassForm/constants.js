import { UNIT_CLASS_STATUS } from '../constants';

export const INITIAL_STATE = Object.freeze({
  unit_id: '',
  name: '',
  grade_level: '',
  room_number: '',
  shift: '',
  school_year: '',
  max_students: '',
  status: UNIT_CLASS_STATUS.ACTIVE,
});
