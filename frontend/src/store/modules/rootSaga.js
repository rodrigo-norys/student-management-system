import { all } from 'redux-saga/effects';

import auth from './auth/sagas.js';
import student from './student/sagas.js';
import photo from './photo/sagas.js';
import staff from './staff/sagas.js';
import guardian from './guardian/sagas.js';
import unit from './unit/sagas.js';
import subject from './subject/sagas.js';

export default function* rootSaga() {
  return yield all([auth, student, photo, staff, guardian, unit, subject]);
}
