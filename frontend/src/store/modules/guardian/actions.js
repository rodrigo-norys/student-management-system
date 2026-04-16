import * as types from './types';

// --- CREATE ---
export function createGuardianRequest(payload) {
  return {
    type: types.CREATE_GUARDIAN_REQUEST,
    payload,
  };
}

export function createGuardianSuccess(payload) {
  return {
    type: types.CREATE_GUARDIAN_SUCCESS,
    payload,
  };
}

export function createGuardianFailure(payload) {
  return {
    type: types.CREATE_GUARDIAN_FAILURE,
    payload,
  };
}

// --- GET ---
export function getGuardiansRequest(payload) {
  return {
    type: types.GET_GUARDIANS_REQUEST,
    payload,
  };
}

export function getGuardiansSuccess(payload) {
  return {
    type: types.GET_GUARDIANS_SUCCESS,
    payload,
  };
}

export function getGuardiansFailure() {
  return {
    type: types.GET_GUARDIANS_FAILURE,
  };
}

// --- UPDATE ---
export function updateGuardianRequest(payload) {
  return {
    type: types.UPDATE_GUARDIAN_REQUEST,
    payload,
  };
}

export function updateGuardianSuccess(payload) {
  return {
    type: types.UPDATE_GUARDIAN_SUCCESS,
    payload,
  };
}

export function updateGuardianFailure(payload) {
  return {
    type: types.UPDATE_GUARDIAN_FAILURE,
    payload,
  };
}

// --- DELETE ---
export function deleteGuardianRequest(payload) {
  return {
    type: types.DELETE_GUARDIAN_REQUEST,
    payload,
  };
}

export function deleteGuardianSuccess(payload) {
  return {
    type: types.DELETE_GUARDIAN_SUCCESS,
    payload,
  };
}

export function deleteGuardianFailure(payload) {
  return {
    type: types.DELETE_GUARDIAN_FAILURE,
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
