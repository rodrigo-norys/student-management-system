import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import axios from '../../../services/axios';
import history from '../../../services/history';

import * as actions from './actions';
import * as studentActions from '../student/actions';
import * as types from './types';

function* loginRequest({ payload }) {
  const { email, password } = payload;
  try {
    const response = yield call(axios.post, '/tokens', { email, password });
    yield put(actions.loginSuccess({ ...response.data }));

    toast.success('You are logged in');

    history.push('/');
  } catch (err) {
    const status = get(err, 'response.status', 0);
    if (status === 401) {
      toast.error('Invalid user or password');
      history.push('/');
    }
    yield put(actions.loginFailure());
  }
}

function* registerRequest({ payload }) {
  const { id, email, password, student_id, access_level_id } = payload;

  try {
    if (id) {
      yield call(axios.put, `/users/${payload.id}`, {
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

      history.push('/users-management');
    }
    yield put(studentActions.getStudentsRequest());
  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    const status = get(e, 'response.status', 0);

    if (status === 401) {
      toast.error('You must sign in your account again');
      yield put(actions.loginFailure());
      history.push('/login');
    }

    if (errors.length > 0) {
      errors.map(error => toast.error(error));
    } else {
      toast.error('Unknown error');
    }
    yield put(actions.registerFailure());
  }
}

function* logoutRequest() {
  try {
    yield call(axios.delete, '/tokens');
    yield put(actions.logoutSuccess());

    toast.info('Logged out successfully.');
    history.push('/login');
  } catch (err) {
    toast.error('Error logging out.');
    yield put(actions.logoutSuccess());
    history.push('/login');
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.LOGOUT_REQUEST, logoutRequest),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
