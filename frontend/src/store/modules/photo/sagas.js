import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import * as actions from './actions';
import * as loginActions from '../auth/actions';
import * as types from './types';
import history from '../../../services/history';
import axios from '../../../services/axios';

function* updatePhotoRequest({ payload }) {
  const { id, userType, formData } = payload;

  try {
    const response = yield call(axios.patch, `/avatar/${userType}/${id}`, formData);

    yield put(actions.updatePhotoSuccess({
      avatar_url: response.data.avatar_url,
      studentId: id
    }));

    toast.success('Photo updated successfully!');

    if (userType === 'students') {
      history.push(`/student/${id}/edit`);
    }

  } catch (err) {
    const status = err.response?.status || 0;
    const errors = err.response?.data?.errors || [];

    if (status === 401) {
      toast.error('Session expired, please log in again.');
      yield put(loginActions.loginFailure());
      history.push('/login');
    } else if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    } else {
      toast.error('An unexpected error occurred while updating the photo.');
    }

    yield put(actions.updatePhotoFailure());
  }
}

export default all([
  takeLatest(types.UPDATE_PHOTO_REQUEST, updatePhotoRequest),
]);
