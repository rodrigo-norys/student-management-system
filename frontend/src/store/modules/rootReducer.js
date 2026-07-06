import { combineReducers } from '@reduxjs/toolkit';

import auth from './auth/reducer';
import student from './student/reducer';
import photo from './photo/reducer';
import staff from './staff/reducer';
import guardian from './guardian/reducer';

export default combineReducers({
  auth,
  student,
  photo,
  staff,
  guardian,
});
