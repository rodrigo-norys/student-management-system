import * as types from './types';

// --- CREATE ---
export function createStudentRequest(payload) {
  return {
    type: types.CREATE_STUDENT_REQUEST,
    payload,
  };
}

export function createStudentSuccess(payload) {
  return {
    type: types.CREATE_STUDENT_SUCCESS,
    payload,
  };
}

export function createStudentFailure(payload) {
  return {
    type: types.CREATE_STUDENT_FAILURE,
    payload,
  };
}

// --- INDEX ---
export function getStudentsRequest(payload) {
  return {
    type: types.GET_STUDENTS_REQUEST,
    payload,
  };
}

export function getStudentsSuccess(payload) {
  return {
    type: types.GET_STUDENTS_SUCCESS,
    payload,
  };
}

export function getStudentsFailure() {
  return {
    type: types.GET_STUDENTS_FAILURE,
  };
}

// --- UPDATE ---
export function updateStudentRequest(payload) {
  return {
    type: types.UPDATE_STUDENT_REQUEST,
    payload,
  };
}

export function updateStudentSuccess(payload) {
  return {
    type: types.UPDATE_STUDENT_SUCCESS,
    payload,
  };
}

export function updateStudentFailure(payload) {
  return {
    type: types.UPDATE_STUDENT_FAILURE,
    payload,
  };
}

// --- DELETE ---
export function deleteStudentRequest(payload) {
  return {
    type: types.DELETE_STUDENT_REQUEST,
    payload,
  };
}

export function deleteStudentSuccess(payload) {
  return {
    type: types.DELETE_STUDENT_SUCCESS,
    payload,
  };
}

export function deleteStudentFailure(payload) {
  return {
    type: types.DELETE_STUDENT_FAILURE,
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
