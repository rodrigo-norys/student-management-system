import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import axios from '../../../services/axios';
import history from '../../../services/history';

import * as actions from './actions';
import * as types from './types';

function* login({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens', payload);
    yield put(actions.loginSuccess(response.data));

    toast.success('You are logged in');

    if (response.data.user.is_temporary) {
      yield call(history.push, '/setup-password');
    } else {
      yield call(history.push, '/');
    }

  } catch (e) {
    const status = e.response?.status || 0;

    if (status === 401) {
      toast.error('Invalid user or password');
    } else {
      toast.error('A connection error occurred. Please try again');
    }

    yield put(actions.loginFailure());
  }
}

function* register({ payload }) {
  const { id, email, password, student_id, access_level_id } = payload;

  try {
    if (id) {
      // Update
      yield call(axios.put, `/users/${id}`, {
        email,
        password: password || undefined,
        access_level_id,
      });

      toast.success('Account updated');
      yield put(actions.registerUpdatedSuccess({ email, password, access_level_id }));
    } else {
      // Create
      yield call(axios.post, '/users', {
        email,
        password,
        access_level_id,
      });

      toast.success('Account created');
      yield put(actions.registerCreatedSuccess({ email, password, access_level_id }));
      yield call(history.push, '/');
    }
  } catch (e) {
    const errors = e.response?.data?.errors || [];
    const status = e.response?.status || 0;

    if (status === 401) {
      toast.error('Your session has expired. Please sign in again');
      yield put(actions.loginFailure());
      yield call(history.push, '/login');
      return;
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    } else {
      toast.error('An unexpected error occurred. Please try again later.');
    }

    yield put(actions.registerFailure());
  }
}

function* validateSession() {
  try {
    const response = yield call(axios.get, '/tokens/validate');

    yield put(actions.loginSuccess(response.data));
  } catch (e) {
    yield put(actions.loginFailure());
  }
}

function* logout() {
  try {
    yield call(axios.delete, '/tokens');

    yield put(actions.logoutSuccess());
    toast.info('You have been logged out.');

    yield call(history.push, '/login');

  } catch (e) {
    toast.error('Session ended with errors, but you were disconnected.');
    yield put(actions.logoutSuccess());
    yield call(history.push, '/login');
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, login),
  takeLatest(types.LOGOUT_REQUEST, logout),
  takeLatest(types.REGISTER_REQUEST, register),
  takeLatest(types.VALIDATE_SESSION_REQUEST, validateSession),
]);
