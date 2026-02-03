import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as types from './types';
import axios from '../../../services/axios';
import history from '../../../services/history';

function* loginRequest({ payload }) {
  const { email, password } = payload;
  try {
    const response = yield call(axios.post, '/tokens', { email, password });
    yield put(actions.loginSuccess({ ...response.data }));

    toast.success('You are logged in');

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    history.push('/');
  } catch (err) {
    const status = get(err, 'response.status', 0);
    if (status === 401) {
      toast.error('Invalid user or password');
     history.push('/');
    }
    delete axios.defaults.headers.Authorization;
    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '');
  if (!token) return;
  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

function* registerRequest({ payload }) {
  const { id, name, email, password } = payload;

  try {
    if (id) {
      yield call(axios.put, '/users', {
        email,
        name,
        password: password || undefined
      });

      toast.success('Successfully account change');
      yield put(actions.registerUpdatedSuccess({ name, email, password }));
    } else {
      yield call(axios.post, '/users', {
        email,
        name,
        password
      });

      toast.success('Successfully account create');
      yield put(actions.registerCreatedSuccess({ name, email, password }));
      history.push('/login');
    }
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

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
