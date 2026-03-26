import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';

import history from '../../../services/history';
import axios from '../../../services/axios';

import * as actions from './actions';
import * as types from './types';

function* createStaff({ payload }) {
  try {
    const { shouldLeave, shouldStay, ...data } = payload;
    const response = yield call(axios.post, '/staff', data);

    toast.success('Staff member created successfully.');
    yield put(actions.createStaffSuccess(response.data));

    shouldLeave
      ? history.push('/staff')
      : shouldStay && history.push(`/staff/${response.data.id}/edit`);

  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An unknown error occurred.');
    yield put(actions.createStaffFailure());
  }
}

function* getStaff() {
  try {
    const response = yield call(axios.get, '/staff');
    yield put(actions.getStaffSuccess(response.data));
  } catch (e) {
    toast.error(get(e, 'response.data.errors[0]', 'Error fetching staff records.'));
    yield put(actions.getStaffFailure());
  }
}

function* updateStaff({ payload }) {
  try {
    const { id, shouldLeave, shouldStay, ...data } = payload;
    const response = yield call(axios.put, `/staff/${id}`, data);

    toast.success('Staff member updated successfully.');
    yield put(actions.updateStaffSuccess(response.data));

   history.push('/staff');

  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An unknown error occurred.');
    yield put(actions.updateStaffFailure());
  }
}

function* deleteStaff({ payload }) {
  try {
    yield call(axios.delete, `/staff/${payload.id}`);
    toast.success('Staff member deleted successfully.');
    yield put(actions.deleteStaffSuccess({ id: payload.id }));
  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error deleting staff member.');
    yield put(actions.deleteStaffFailure());
  }
}

function* getCep({ payload }) {
  try {
    const response = yield call(axios.get, `https://viacep.com.br/ws/${payload}/json/`);

    if (response.data.erro) {
      toast.error('Invalid CEP.');
      yield put(actions.getCepFailure());
    } else {
      yield put(actions.getCepSuccess({
        street: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf,
      }));
    }
  } catch (e) {
    toast.error(get(e, 'response.data.errors[0]', 'Error fetching CEP.'));
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
