import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import history from '../../../services/history';
import axios from '../../../services/axios';
import * as actions from './actions';
import * as types from './types';

function* createUnitClass({ payload }) {
  try {
    const { shouldLeave, ...unitClassData } = payload;
    const response = yield call(axios.post, '/unit-classes', unitClassData);

    toast.success('Class successfully created');
    yield put(actions.createUnitClassSuccess(response.data));

    if (shouldLeave) {
      history.push('/unit-classes');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');

    yield put(actions.createUnitClassFailure());
  }
}

function* getUnitClasses({ payload }) {
  try {
    let response;
    const isPaginationRequest = typeof payload === 'object' && payload !== null;
    const isSingleClassRequest =
      typeof payload === 'string' || typeof payload === 'number';

    if (isPaginationRequest) {
      const { page, limit } = payload;
      response = yield call(axios.get, '/unit-classes', {
        params: {
          page,
          limit,
        },
      });
    } else if (isSingleClassRequest) {
      response = yield call(axios.get, `/unit-classes/${payload}`);
    } else {
      response = yield call(axios.get, '/unit-classes');
    }

    yield put(actions.getUnitClassesSuccess(response.data));
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error fetching class records.');

    yield put(actions.getUnitClassesFailure());
  }
}

function* updateUnitClass({ payload }) {
  try {
    const { id, shouldLeave, ...unitClassData } = payload;
    const response = yield call(
      axios.put,
      `/unit-classes/${id}`,
      unitClassData,
    );

    toast.success('Class successfully updated');
    yield put(actions.updateUnitClassSuccess(response.data));

    if (shouldLeave) {
      history.push('/unit-classes');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('An error occurred while saving.');

    yield put(actions.updateUnitClassFailure());
  }
}

function* deleteUnitClass({ payload }) {
  const id = payload;
  try {
    if (id) {
      yield call(axios.delete, `/unit-classes/${id}`);
      yield put(actions.deleteUnitClassSuccess(id));
      toast.success('Class status updated to INACTIVE');
    }
  } catch (e) {
    const errors = e?.response?.data?.errors ?? [];
    errors.length > 0
      ? errors.forEach((error) => toast.error(error))
      : toast.error('Error deleting class.');

    yield put(actions.deleteUnitClassFailure());
  }
}

function* getUnitOptions() {
  try {
    const response = yield call(axios.get, '/units/lookup');
    yield put(actions.getUnitOptionsSuccess(response.data.data));
  } catch {
    toast.error('Error fetching units for selection.');
    yield put(actions.getUnitOptionsFailure());
  }
}

export default all([
  takeLatest(types.CREATE_UNIT_CLASS_REQUEST, createUnitClass),
  takeLatest(types.GET_UNIT_CLASSES_REQUEST, getUnitClasses),
  takeLatest(types.UPDATE_UNIT_CLASS_REQUEST, updateUnitClass),
  takeLatest(types.DELETE_UNIT_CLASS_REQUEST, deleteUnitClass),
  takeLatest(types.GET_UNIT_OPTIONS_REQUEST, getUnitOptions),
]);
