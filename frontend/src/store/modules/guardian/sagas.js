import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import axiosLib from 'axios';
import history from '../../../services/history';
import axios from '../../../services/axios';
import * as actions from './actions';
import * as types from './types';

function* createGuardian({ payload }) {
  try {
    const { shouldLeave, shouldStay, ...guardianData } = payload;
    const response = yield call(axios.post, '/guardians', guardianData);

    toast.success('Guardian successfully created');
    yield put(actions.createGuardianSuccess(response.data));

    shouldLeave
      ? history.push('/guardians')
      : shouldStay && history.push(`/guardian/${response.data.id}/edit`);
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');

    yield put(actions.createGuardianFailure());
  }
}

function* getGuardians({ payload }) {
  try {
    let response;
    const isPaginationRequest = typeof payload === 'object' && payload !== null;
    const isSingleGuardianRequest =
      typeof payload === 'string' || typeof payload === 'number';

    if (isPaginationRequest) {
      const { page, limit } = payload;
      response = yield call(axios.get, '/guardians', {
        params: {
          page,
          limit,
        },
      });
    } else if (isSingleGuardianRequest) {
      response = yield call(axios.get, `/guardians/${payload}`);
    } else {
      response = yield call(axios.get, '/guardians');
    }

    yield put(actions.getGuardiansSuccess(response.data));
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error fetching guardian records.');

    yield put(actions.getGuardiansFailure());
  }
}

function* updateGuardian({ payload }) {
  try {
    const { id, shouldLeave, ...guardianData } = payload;
    const response = yield call(axios.put, `/guardians/${id}`, guardianData);

    toast.success('Guardian successfully updated');
    yield put(actions.updateGuardianSuccess(response.data));

    if (shouldLeave) {
      history.push('/guardians');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');

    yield put(actions.updateGuardianFailure());
  }
}

function* deleteGuardian({ payload }) {
  const id = payload;
  try {
    if (id) {
      yield call(axios.delete, `/guardians/${id}`);
      yield put(actions.deleteGuardianSuccess(id));
      toast.success('Guardian status updated to INACTIVE');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error deleting guardian.');

    yield put(actions.deleteGuardianFailure());
  }
}

function* getCep({ payload }) {
  try {
    const response = yield call(
      axiosLib.get,
      `https://brasilapi.com.br/api/cep/v1/${payload}`,
    );
    yield put(actions.getCepSuccess(response.data));
  } catch {
    toast.error('CEP not found. Fill in the address manually.');
    yield put(actions.getCepFailure());
  }
}

export default all([
  takeLatest(types.CREATE_GUARDIAN_REQUEST, createGuardian),
  takeLatest(types.GET_GUARDIANS_REQUEST, getGuardians),
  takeLatest(types.UPDATE_GUARDIAN_REQUEST, updateGuardian),
  takeLatest(types.DELETE_GUARDIAN_REQUEST, deleteGuardian),
  takeLatest(types.GET_CEP_REQUEST, getCep),
]);
