import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';

import axios from '../../../services/axios';

import * as actions from './actions';
import * as types from './types';

function* getStudentsRequest() {
  try {
    const response = yield call(axios.get, '/students');
    yield put(actions.getStudentsSuccess(response.data));
  } catch (err) {
    const errors = get(err, 'response.data.errors', []);
    errors.map(error => toast.error(error));
    yield put(actions.getStudentsFailure());
  }
}

function* createStudentRequest({ payload }) {
  try {
    const { id, name, last_name, email, age, weight, height, shouldLeave, shouldStay, navigate } = payload;
    if (id) {
      yield call(axios.put, `/students/${id}`, {
        name, last_name, email, age, weight, height
      });

      yield put(actions.updateStudentSuccess(payload));
      toast.success('Successfully student updated');
    } else {
      const response = yield call(axios.post, '/students', {
        name, last_name, email, age, weight, height
      });

      yield put(actions.createStudentSuccess(response.data));
      toast.success('Successfully student created');
    }

    if (shouldStay) navigate(0);
    if (shouldLeave) navigate('/');

  } catch (err) {
    const errors = get(err, 'response.data.errors', []);
    errors.map(error => toast.error(error));
    yield put(actions.createStudentFailure());
  }
}

function* deleteStudentRequest({ payload }) {
  const id = payload;
  try {
    if (id) {
      yield call(axios.delete, `students/${id}`);
      yield put(actions.deleteStudentSuccess(id));
      toast.success('Successfully student deleted');
    }
  } catch (err) {
    const errors = get(err, 'response.data.errors', []);
    errors.map(error => toast.error(error));

    yield put(actions.deleteStudentFailure());
  }
}

export default all([
  takeLatest(types.GET_STUDENTS_REQUEST, getStudentsRequest),
  takeLatest(types.DELETE_STUDENT_REQUEST, deleteStudentRequest),
  takeLatest(types.CREATE_STUDENT_REQUEST, createStudentRequest)
]);
