import * as types from './types';

// --- CREATE ---
export function createStaffRequest(payload) {
  return {
    type: types.CREATE_STAFF_REQUEST,
    payload,
  };
}

export function createStaffSuccess(payload) {
  return {
    type: types.CREATE_STAFF_SUCCESS,
    payload,
  };
}

export function createStaffFailure(payload) {
  return {
    type: types.CREATE_STAFF_FAILURE,
    payload,
  };
}

// --- GET ---
export function getStaffRequest(payload) {
  return {
    type: types.GET_STAFF_REQUEST,
    payload,
  };
}

export function getStaffSuccess(payload) {
  return {
    type: types.GET_STAFF_SUCCESS,
    payload,
  };
}

export function getStaffFailure() {
  return {
    type: types.GET_STAFF_FAILURE,
  };
}

// --- UPDATE ---
export function updateStaffRequest(payload) {
  return {
    type: types.UPDATE_STAFF_REQUEST,
    payload,
  };
}

export function updateStaffSuccess(payload) {
  return {
    type: types.UPDATE_STAFF_SUCCESS,
    payload,
  };
}

export function updateStaffFailure(payload) {
  return {
    type: types.UPDATE_STAFF_FAILURE,
    payload,
  };
}

// --- DELETE ---
export function deleteStaffRequest(payload) {
  return {
    type: types.DELETE_STAFF_REQUEST,
    payload,
  };
}

export function deleteStaffSuccess(payload) {
  return {
    type: types.DELETE_STAFF_SUCCESS,
    payload,
  };
}

export function deleteStaffFailure(payload) {
  return {
    type: types.DELETE_STAFF_FAILURE,
    payload,
  };
}

// --- CEP ---
export function getCepRequest(payload) {
  return {
    type: types.GET_CEP_REQUEST,
    payload,
  };
}

export function getCepSuccess(payload) {
  return {
    type: types.GET_CEP_SUCCESS,
    payload,
  };
}

export function getCepFailure() {
  return {
    type: types.GET_CEP_FAILURE,
  };
}
