import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as types from './types';
import axios from '../../../services/axios';

function* updatePhotoRequest({ payload }) {
  try {
    const { formData, id } = payload;

    yield call(axios.put, `/photos/${id}`, { formData, id });

    yield put(actions.updatePhotoSuccess(payload));
    toast.success('Successfully profile picture updated');

  } catch (error) {
    const errors = get(err, 'response.data.errors', []);
    errors.map(error => toast.error(error));
    yield put(actions.updatePhotoFailure());
  }
}

export default all([
  takeLatest(types.UPDATE_PHOTO_REQUEST, updatePhotoRequest()),
]);
