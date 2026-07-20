import * as types from './types';

// --- CREATE ---
export function createUnitRequest(payload) {
  return {
    type: types.CREATE_UNIT_REQUEST,
    payload,
  };
}

export function createUnitSuccess(payload) {
  return {
    type: types.CREATE_UNIT_SUCCESS,
    payload,
  };
}

export function createUnitFailure() {
  return {
    type: types.CREATE_UNIT_FAILURE,
  };
}

// --- GET ---
export function getUnitsRequest(payload) {
  return {
    type: types.GET_UNITS_REQUEST,
    payload,
  };
}

export function getUnitsSuccess(payload) {
  return {
    type: types.GET_UNITS_SUCCESS,
    payload,
  };
}

export function getUnitsFailure() {
  return {
    type: types.GET_UNITS_FAILURE,
  };
}

// --- UPDATE ---
export function updateUnitRequest(payload) {
  return {
    type: types.UPDATE_UNIT_REQUEST,
    payload,
  };
}

export function updateUnitSuccess(payload) {
  return {
    type: types.UPDATE_UNIT_SUCCESS,
    payload,
  };
}

export function updateUnitFailure() {
  return {
    type: types.UPDATE_UNIT_FAILURE,
  };
}

// --- DELETE ---
export function deleteUnitRequest(payload) {
  return {
    type: types.DELETE_UNIT_REQUEST,
    payload,
  };
}

export function deleteUnitSuccess(payload) {
  return {
    type: types.DELETE_UNIT_SUCCESS,
    payload,
  };
}

export function deleteUnitFailure() {
  return {
    type: types.DELETE_UNIT_FAILURE,
  };
}
