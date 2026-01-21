import { combineReducers } from "redux";

import auth from './auth/reducer.js';
import student from './student/reducer.js';

export default combineReducers({
  auth,
  student,
});
