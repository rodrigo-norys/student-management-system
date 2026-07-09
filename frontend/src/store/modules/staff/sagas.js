import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import axiosLib from 'axios';

import history from 'services/history';
import axios from 'services/axios';

import * as actions from './actions';
import * as types from './types';

function* createStaff({ payload }) {
  try {
    const { shouldLeave, shouldStay, ...staffData } = payload;
    const response = yield call(axios.post, '/staff', staffData);

    toast.success('Staff member created successfully.');
    yield put(actions.createStaffSuccess(response.data));

    shouldLeave
      ? history.push('/dashboard')
      : shouldStay && history.push(`/staff/${response.data.id}/edit`);
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');
    yield put(actions.createStaffFailure());
  }
}

function* getStaff({ payload }) {
  try {
    let response;
    const isPaginationRequest = typeof payload === 'object' && payload !== null;
    const isSingleStaffRequest =
      typeof payload === 'string' || typeof payload === 'number';

    if (isPaginationRequest) {
      const { page, limit } = payload;
      response = yield call(axios.get, '/staff', {
        params: {
          page,
          limit,
        },
      });
    } else if (isSingleStaffRequest) {
      response = yield call(axios.get, `/staff/${payload}`);
    } else {
      response = yield call(axios.get, '/staff');
    }

    yield put(actions.getStaffSuccess(response.data));
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error fetching staff records.');
    yield put(actions.getStaffFailure());
  }
}

function* updateStaff({ payload }) {
  try {
    const { id, shouldLeave, shouldStay, ...staffData } = payload;
    const response = yield call(axios.put, `/staff/${id}`, staffData);

    toast.success('Staff member updated successfully.');
    yield put(actions.updateStaffSuccess(response.data));

    history.push('/staff');
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');
    yield put(actions.updateStaffFailure());
  }
}

function* deleteStaff({ payload }) {
  const id = payload;

  try {
    if (id) {
      yield call(axios.delete, `staff/${id}`);
      yield put(actions.deleteStaffSuccess(id));
      toast.success('Staff status updated to INACTIVE');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error deleting staff member.');
    yield put(actions.deleteStaffFailure());
  }
}

function* getCep({ payload }) {
  try {
    const response = yield call(
      axiosLib.get,
      `https://brasilapi.com.br/api/cep/v1/${payload}`,
    );
    yield put(actions.getCepSuccess(response.data));
  } catch (e) {
    toast.error('CEP not found. Fill in the address manually.');
    yield put(actions.getCepFailure());
  }
}

export default all([
  takeLatest(types.CREATE_STAFF_REQUEST, createStaff),
  takeLatest(types.GET_STAFF_REQUEST, getStaff),
  takeLatest(types.UPDATE_STAFF_REQUEST, updateStaff),
  takeLatest(types.DELETE_STAFF_REQUEST, deleteStaff),
  takeLatest(types.GET_CEP_REQUEST, getCep),
]);
