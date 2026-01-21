import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as loginActions from '../auth/actions.js';
import * as types from './types';
import axios from '../../../services/axios';
import history from '../../../services/history';

function* updatePhotoRequest({ payload }) {
  try {
    const { formData, id } = payload;
    const response = yield call(axios.post, `/photos/${id}`, formData)

    yield put(actions.updatePhotoSuccess({
      id,
      photo: response.data.url
    }));
    toast.success('Successfully');
    history.push(`/student/${id}/edit`);

  } catch (err) {
    const status = get(err, 'response.status', 0);
    if (status === 500) {
      toast.error('Internal server error. Please check the backend console.');
    } else if (status === 401) {
      toast.error('Session expired, please log in again.');
      history.push('/');
      yield put(loginActions.loginFailure());
    } else {
      const errors = get(err, 'response.data.errors', []);
      errors.map(error => toast.error(error));
    }
    const errors = get(err, 'response.data.errors', []);

    if (errors.length > 0) {
      errors.map(error => toast.error(error));
    } else {
      toast.error('An unexpected error occurred.');
    }
  }
  yield put(actions.updatePhotoFailure());
}

export default all([
  takeLatest(types.UPDATE_PHOTO_REQUEST, updatePhotoRequest),
]);
