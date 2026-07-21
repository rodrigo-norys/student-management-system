import { combineReducers } from '@reduxjs/toolkit';

import auth from './auth/reducer';
import student from './student/reducer';
import photo from './photo/reducer';
import staff from './staff/reducer';
import guardian from './guardian/reducer';
import unit from './unit/reducer';
import subject from './subject/reducer';
import unitClass from './unitClass/reducer';

export default combineReducers({
  auth,
  student,
  photo,
  staff,
  guardian,
  unit,
  subject,
  unitClass,
});
