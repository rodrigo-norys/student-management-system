import { call, put, all, select, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import axios from '../../../services/axios';
import history from '../../../services/history';

import * as actions from './actions';
import * as types from './types';

function* login({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens', payload);
    yield put(actions.loginSuccess(response.data));

    toast.success('You are logged in');

    response.data.user.is_temporary
      ? history.push('/setup-password')
      : history.push('/');

  } catch (e) {
    const status = get(e, 'response.status', 0);

    status === 401 && toast.error('Invalid user or password');

    yield put(actions.loginFailure());
  }
}

function* register({ payload }) {
  const { id, email, password, student_id, access_level_id } = payload;

  try {
    if (id) {
      yield call(axios.put, `/users/${id}`, {
        email,
        password: password || undefined,
        access_level_id,
        student_id,
      });

      toast.success('Account updated');
      yield put(actions.registerUpdatedSuccess({ email, password, access_level_id }));
    } else {
      yield call(axios.post, '/users', {
        email,
        password,
        access_level_id,
        student_id,
      });

      toast.success('Account created');
      yield put(actions.registerCreatedSuccess({ email, password, access_level_id }));
      history.push('/');
    }
  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    const status = get(e, 'response.status', 0);

    if (status === 401) {
      toast.error('You must sign in your account again');
      yield put(actions.loginFailure());
      history.push('/login');
    }

    errors.length > 0
      ? errors.forEach(error => toast.error(error))
      : toast.error('Unknown error');

    yield put(actions.registerFailure());
  }
}

function* logout() {
  try {
    yield call(axios.delete, '/tokens');
    yield put(actions.logoutSuccess());
    toast.info('You logged out');
    history.push('/login');
  } catch (e) {
    toast.error('Error logging out.');
    yield put(actions.logoutSuccess());
    history.push('/login');
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

export default all([
  takeLatest(types.LOGIN_REQUEST, login),
  takeLatest(types.LOGOUT_REQUEST, logout),
  takeLatest(types.REGISTER_REQUEST, register),
  takeLatest(types.VALIDATE_SESSION_REQUEST, validateSession),
]);
