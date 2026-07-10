import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import axiosLib from 'axios';
import history from 'services/history';
import axios from 'services/axios';
import * as actions from './actions';
import * as types from './types';

function* createStudent({ payload }) {
  try {
    const { shouldStay, ...studentData } = payload;
    const response = yield call(axios.post, '/students', studentData);

    toast.success('Student created successfully');
    yield put(actions.createStudentSuccess(response.data));

    if (!shouldStay) {
      history.push('/students');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    } else {
      toast.error('An error occurred while saving the student.');
    }

    yield put(actions.createStudentFailure());
  }
}

function* updateStudent({ payload }) {
  try {
    const { id, ...studentData } = payload;
    const response = yield call(axios.put, `/students/${id}`, studentData);

    toast.success('Student record updated');
    yield put(actions.updateStudentSuccess(response.data));

    history.push('/students');
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    } else {
      toast.error('An error occurred during update.');
    }

    yield put(actions.updateStudentFailure());
  }
}

function* getStudents({ payload }) {
  try {
    let response;
    const isPaginationRequest = typeof payload === 'object' && payload !== null;
    const isSingleStudentRequest =
      typeof payload === 'string' || typeof payload === 'number';

    if (isPaginationRequest) {
      const { page, limit, searchTerm } = payload;
      response = yield call(axios.get, '/students', {
        params: { page, limit, searchTerm },
      });
    } else if (isSingleStudentRequest) {
      response = yield call(axios.get, `/students/${payload}`);
    } else {
      response = yield call(axios.get, '/students');
    }

    yield put(actions.getStudentsSuccess(response.data));
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    } else {
      toast.error('Failed to fetch student records.');
    }

    yield put(actions.getStudentsFailure());
  }
}

function* deleteStudent({ payload }) {
  const id = payload;
  try {
    if (id) {
      yield call(axios.delete, `students/${id}`);
      yield put(actions.deleteStudentSuccess(id));
      toast.success('Student record deactivated');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    } else {
      toast.error('Error during record deletion.');
    }

    yield put(actions.deleteStudentFailure());
  }
}

function* getCep({ payload }) {
  try {
    const response = yield call(
      axiosLib.get,
      `https://brasilapi.com.br/api/cep/v1/${payload}`,
    );
    yield put(actions.getCepSuccess(response.data));
  } catch {
    toast.error('Postal code not found. Please type manually.');
    yield put(actions.getCepFailure());
  }
}

export default all([
  takeLatest(types.CREATE_STUDENT_REQUEST, createStudent),
  takeLatest(types.UPDATE_STUDENT_REQUEST, updateStudent),
  takeLatest(types.GET_STUDENTS_REQUEST, getStudents),
  takeLatest(types.DELETE_STUDENT_REQUEST, deleteStudent),
  takeLatest(types.GET_CEP_REQUEST, getCep),
]);
