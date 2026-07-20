import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import axios from '../../../services/axios';
import * as actions from './actions';
import * as types from './types';

function* createUnit({ payload }) {
  try {
    const { shouldLeave, ...unitData } = payload;
    const response = yield call(axios.post, '/units', unitData);

    toast.success('Unit successfully created');
    yield put(actions.createUnitSuccess(response.data));

    if (shouldLeave) {
      history.push('/units');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');

    yield put(actions.createUnitFailure());
  }
}

function* getUnits({ payload }) {
  try {
    let response;
    const isPaginationRequest = typeof payload === 'object' && payload !== null;
    const isSingleUnitRequest =
      typeof payload === 'string' || typeof payload === 'number';

    if (isPaginationRequest) {
      const { page, limit } = payload;
      response = yield call(axios.get, '/units', {
        params: {
          page,
          limit,
        },
      });
    } else if (isSingleUnitRequest) {
      response = yield call(axios.get, `/units/${payload}`);
    } else {
      response = yield call(axios.get, '/units');
    }

    yield put(actions.getUnitsSuccess(response.data));
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error fetching unit records.');

    yield put(actions.getUnitsFailure());
  }
}

function* updateUnit({ payload }) {
  try {
    const { id, shouldLeave, ...unitData } = payload;
    const response = yield call(axios.put, `/units/${id}`, unitData);

    toast.success('Unit successfully updated');
    yield put(actions.updateUnitSuccess(response.data));

    if (shouldLeave) {
      history.push('/units');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');

    yield put(actions.updateUnitFailure());
  }
}

function* deleteUnit({ payload }) {
  const id = payload;
  try {
    if (id) {
      yield call(axios.delete, `/units/${id}`);
      yield put(actions.deleteUnitSuccess(id));
      toast.success('Unit status updated to INACTIVE');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error deleting unit.');

    yield put(actions.deleteUnitFailure());
  }
}

export default all([
  takeLatest(types.CREATE_UNIT_REQUEST, createUnit),
  takeLatest(types.GET_UNITS_REQUEST, getUnits),
  takeLatest(types.UPDATE_UNIT_REQUEST, updateUnit),
  takeLatest(types.DELETE_UNIT_REQUEST, deleteUnit),
]);
