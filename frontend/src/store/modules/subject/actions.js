import * as types from './types';

// --- CREATE ---
export function createSubjectRequest(payload) {
  return {
    type: types.CREATE_SUBJECT_REQUEST,
    payload,
  };
}

export function createSubjectSuccess(payload) {
  return {
    type: types.CREATE_SUBJECT_SUCCESS,
    payload,
  };
}

export function createSubjectFailure() {
  return {
    type: types.CREATE_SUBJECT_FAILURE,
  };
}

// --- GET ---
export function getSubjectsRequest(payload) {
  return {
    type: types.GET_SUBJECTS_REQUEST,
    payload,
  };
}

export function getSubjectsSuccess(payload) {
  return {
    type: types.GET_SUBJECTS_SUCCESS,
    payload,
  };
}

export function getSubjectsFailure() {
  return {
    type: types.GET_SUBJECTS_FAILURE,
  };
}

// --- UPDATE ---
export function updateSubjectRequest(payload) {
  return {
    type: types.UPDATE_SUBJECT_REQUEST,
    payload,
  };
}

export function updateSubjectSuccess(payload) {
  return {
    type: types.UPDATE_SUBJECT_SUCCESS,
    payload,
  };
}

export function updateSubjectFailure() {
  return {
    type: types.UPDATE_SUBJECT_FAILURE,
  };
}

// --- DELETE ---
export function deleteSubjectRequest(payload) {
  return {
    type: types.DELETE_SUBJECT_REQUEST,
    payload,
  };
}

export function deleteSubjectSuccess(payload) {
  return {
    type: types.DELETE_SUBJECT_SUCCESS,
    payload,
  };
}

export function deleteSubjectFailure() {
  return {
    type: types.DELETE_SUBJECT_FAILURE,
  };
}
