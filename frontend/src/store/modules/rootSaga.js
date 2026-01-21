import { all } from 'redux-saga/effects';

import auth from './auth/sagas.js';
import student from './student/sagas.js';
import photo from './photo/sagas.js'

export default function* rootSaga() {
  return yield all ([auth, student, photo]);
}
