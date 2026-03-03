import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import axiosLib from 'axios';

import history from '../../../services/history';
import axios from '../../../services/axios';

import * as actions from './actions';
import * as types from './types';

function* getStudentsRequest({ payload }) {
  try {
    const response = payload
      ? yield call(axios.get, `/students/${payload}`)
      : yield call(axios.get, '/students');
    yield put(actions.getStudentsSuccess(response.data));
  } catch (err) {
    const errors = get(err, 'response.data.errors', []);
    errors.map(error => toast.error(error));
    yield put(actions.getStudentsFailure());
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

function* createStudentRequest({ payload }) {
  try {
    const {
      id, name, last_name, email,
      registration_number, cpf, birth_date,
      avatar_url, blood_type, medical_notes,

      zip_code, street, number, complement, neighborhood, city, state,
      shouldLeave, shouldStay
    } = payload;

    const studentData = {
      name, last_name, email,
      registration_number, cpf, birth_date,
      avatar_url, blood_type, medical_notes,

      zip_code, street, number, complement, neighborhood, city, state
    };

    if (id) {
      const response = yield call(axios.put, `/students/${id}`, studentData);
      yield put(actions.updateStudentSuccess(response.data));
      toast.success('Student successfully updated');
    } else {
      const response = yield call(axios.post, '/students', studentData);
      yield put(actions.createStudentSuccess(response.data));
      toast.success('Student successfully created');
    }

    if (shouldStay) {
      history.go(0);
    } else if (shouldLeave) {
      history.push('/');
    }

  } catch (err) {
    const errors = get(err, 'response.data.errors', []);
    if (errors.length > 0) {
      errors.map(error => toast.error(error));
    } else {
      toast.error('An error occurred while saving.');
    }
    yield put(actions.createStudentFailure());
  }
}

function* deleteStudentRequest({ payload }) {
  const id = payload;
  try {
    if (id) {
      yield call(axios.delete, `students/${id}`);
      yield put(actions.deleteStudentSuccess(id));
      toast.success('Student successfully deleted');
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
  takeLatest(types.CREATE_STUDENT_REQUEST, createStudentRequest),
  takeLatest(types.GET_CEP_REQUEST, getCep),
]);
