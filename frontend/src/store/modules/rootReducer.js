import { combineReducers } from '@reduxjs/toolkit';

import auth from './auth/reducer';
import student from './student/reducer';
import photo from './photo/reducer';

export default combineReducers({
  auth,
  student,
  photo,
});
