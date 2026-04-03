import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import axiosLib from 'axios';

import history from '../../../services/history';
import axios from '../../../services/axios';

import * as actions from './actions';
import * as types from './types';

function* createStudent({ payload }) {
  try {
    const { shouldLeave, shouldStay, ...studentData } = payload;
    const response = yield call(axios.post, '/students', studentData);

    toast.success('Student successfully created');
    yield put(actions.createStudentSuccess(response.data));

    shouldLeave
      ? history.push('/')
      : shouldStay && history.push(`/student/${response.data.id}/edit`);

  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');
    yield put(actions.createStudentFailure());
  }
}

function* getStudents({ payload }) {
  try {
    let response;
    const isPaginationRequest = typeof payload === 'object' && payload !== null;
    const isSingleStudentRequest = typeof payload === 'string' || typeof payload === 'number';

    if (isPaginationRequest) {
      const { page, limit } = payload;
      response = yield call(axios.get, '/students', {
        params: {
          page,
          limit
        }
      });
    } else if (isSingleStudentRequest) {
      response = yield call(axios.get, `/students/${payload}`);
    } else {
      response = yield call(axios.get, '/students');
    }

    yield put(actions.getStudentsSuccess(response.data));
  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error fetching student records.');
    yield put(actions.getStudentsFailure());
  }
}

function* updateStudent({ payload }) {
  try {
    const { id, shouldLeave, shouldStay, ...studentData } = payload;
    const response = yield call(axios.put, `/students/${id}`, studentData);

    toast.success('Student successfully updated');
    yield put(actions.updateStudentSuccess(response.data));

    history.push('/');

  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');
    yield put(actions.updateStudentFailure());
  }
}

function* deleteStudent({ payload }) {
  const id = payload;
  try {
    if (id) {
      yield call(axios.delete, `students/${id}`);
      yield put(actions.deleteStudentSuccess(id));
      toast.success('Student successfully deleted');
    }
  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error deleting student.');
    yield put(actions.deleteStudentFailure());
  }
}

function* getCep({ payload }) {
  try {
    const response = yield call(axiosLib.get, `https://brasilapi.com.br/api/cep/v1/${payload}`);
    yield put(actions.getCepSuccess(response.data));
  } catch (e) {
    yield put(actions.getCepFailure());
    toast.error('CEP not found. Fill in the address manually.');
  }
}

export default all([
  takeLatest(types.CREATE_STUDENT_REQUEST, createStudent),
  takeLatest(types.GET_STUDENTS_REQUEST, getStudents),
  takeLatest(types.UPDATE_STUDENT_REQUEST, updateStudent),
  takeLatest(types.DELETE_STUDENT_REQUEST, deleteStudent),
  takeLatest(types.GET_CEP_REQUEST, getCep),
]);
