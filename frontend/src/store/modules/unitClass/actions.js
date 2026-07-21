import * as types from './types';

// --- CREATE ---
export function createUnitClassRequest(payload) {
  return {
    type: types.CREATE_UNIT_CLASS_REQUEST,
    payload,
  };
}

export function createUnitClassSuccess(payload) {
  return {
    type: types.CREATE_UNIT_CLASS_SUCCESS,
    payload,
  };
}

export function createUnitClassFailure() {
  return {
    type: types.CREATE_UNIT_CLASS_FAILURE,
  };
}

// --- GET ---
export function getUnitClassesRequest(payload) {
  return {
    type: types.GET_UNIT_CLASSES_REQUEST,
    payload,
  };
}

export function getUnitClassesSuccess(payload) {
  return {
    type: types.GET_UNIT_CLASSES_SUCCESS,
    payload,
  };
}

export function getUnitClassesFailure() {
  return {
    type: types.GET_UNIT_CLASSES_FAILURE,
  };
}

// --- UPDATE ---
export function updateUnitClassRequest(payload) {
  return {
    type: types.UPDATE_UNIT_CLASS_REQUEST,
    payload,
  };
}

export function updateUnitClassSuccess(payload) {
  return {
    type: types.UPDATE_UNIT_CLASS_SUCCESS,
    payload,
  };
}

export function updateUnitClassFailure() {
  return {
    type: types.UPDATE_UNIT_CLASS_FAILURE,
  };
}

// --- DELETE ---
export function deleteUnitClassRequest(payload) {
  return {
    type: types.DELETE_UNIT_CLASS_REQUEST,
    payload,
  };
}

export function deleteUnitClassSuccess(payload) {
  return {
    type: types.DELETE_UNIT_CLASS_SUCCESS,
    payload,
  };
}

export function deleteUnitClassFailure() {
  return {
    type: types.DELETE_UNIT_CLASS_FAILURE,
  };
}

// --- UNIT OPTIONS ---
export function getUnitOptionsRequest() {
  return {
    type: types.GET_UNIT_OPTIONS_REQUEST,
  };
}

export function getUnitOptionsSuccess(payload) {
  return {
    type: types.GET_UNIT_OPTIONS_SUCCESS,
    payload,
  };
}

export function getUnitOptionsFailure() {
  return {
    type: types.GET_UNIT_OPTIONS_FAILURE,
  };
}
