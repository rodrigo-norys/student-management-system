import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import axios from '../../../services/axios';
import * as actions from './actions';
import * as types from './types';

function* createSubject({ payload }) {
  try {
    const { shouldLeave, ...subjectData } = payload;
    const response = yield call(axios.post, '/subjects', subjectData);

    toast.success('Subject successfully created');
    yield put(actions.createSubjectSuccess(response.data));

    if (shouldLeave) {
      history.push('/subjects');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');

    yield put(actions.createSubjectFailure());
  }
}

function* getSubjects({ payload }) {
  try {
    let response;
    const isPaginationRequest = typeof payload === 'object' && payload !== null;
    const isSingleSubjectRequest =
      typeof payload === 'string' || typeof payload === 'number';

    if (isPaginationRequest) {
      const { page, limit } = payload;
      response = yield call(axios.get, '/subjects', {
        params: {
          page,
          limit,
        },
      });
    } else if (isSingleSubjectRequest) {
      response = yield call(axios.get, `/subjects/${payload}`);
    } else {
      response = yield call(axios.get, '/subjects');
    }

    yield put(actions.getSubjectsSuccess(response.data));
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error fetching subject records.');

    yield put(actions.getSubjectsFailure());
  }
}

function* updateSubject({ payload }) {
  try {
    const { id, shouldLeave, ...subjectData } = payload;
    const response = yield call(axios.put, `/subjects/${id}`, subjectData);

    toast.success('Subject successfully updated');
    yield put(actions.updateSubjectSuccess(response.data));

    if (shouldLeave) {
      history.push('/subjects');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');

    yield put(actions.updateSubjectFailure());
  }
}

function* deleteSubject({ payload }) {
  const id = payload;
  try {
    if (id) {
      yield call(axios.delete, `/subjects/${id}`);
      yield put(actions.deleteSubjectSuccess(id));
      toast.success('Subject status updated to INACTIVE');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error deleting subject.');

    yield put(actions.deleteSubjectFailure());
  }
}

export default all([
  takeLatest(types.CREATE_SUBJECT_REQUEST, createSubject),
  takeLatest(types.GET_SUBJECTS_REQUEST, getSubjects),
  takeLatest(types.UPDATE_SUBJECT_REQUEST, updateSubject),
  takeLatest(types.DELETE_SUBJECT_REQUEST, deleteSubject),
]);
