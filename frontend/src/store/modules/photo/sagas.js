import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as loginActions from '../auth/actions.js';
import * as types from './types';
import history from '../../../services/history';
import axios from '../../../services/axios';

function* updatePhotoRequest({ payload }) {
  const { formData, id } = payload;
  try {
    const response = yield call(axios.patch, `/students/avatar/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    yield put(actions.updatePhotoSuccess({
      id,
      photo: response.data.avatar_url
    }));

    toast.success('Photo updated successfully!');
    history.push(`/student/${id}/edit`);

  } catch (err) {
    const status = get(err, 'response.status', 0);
    const errors = get(err, 'response.data.errors', []);

    if (status === 401) {
      toast.error('Session expired, please log in again.');
      yield put(loginActions.loginFailure());
      history.push('/login');
    } else if (errors.length > 0) {
      errors.map(error => toast.error(error));
    } else {
      toast.error('An unexpected error occurred.');
    }
    yield put(actions.updatePhotoFailure());
  }
}

export default all([
  takeLatest(types.UPDATE_PHOTO_REQUEST, updatePhotoRequest),
]);
