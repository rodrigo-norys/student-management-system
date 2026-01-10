import * as types from './types';

// CREATE STUDENT
export function createStudentRequest(studentData) {
  return {
    type: types.CREATE_STUDENT_REQUEST,
    payload: studentData,
  };
}

export function createStudentSuccess(studentData) {
  return {
    type: types.CREATE_STUDENT_SUCCESS,
    payload: studentData,
  };
}

export function createStudentFailure(studentData) {
  return {
    type: types.CREATE_STUDENT_FAILURE,
    payload: studentData,
  };
}

// GET STUDENT
export function getStudentRequest() {
  return {
    type: types.GET_STUDENT_REQUEST,
  };
}

export function getStudentSuccess(students) {
  return {
    type: types.GET_STUDENT_SUCCESS,
    payload: students,
  };
}

export function getStudentFailure() {
  return {
    type: types.GET_STUDENT_FAILURE,
  };
}

// UPDATE STUDENT
export function updateStudentRequest(updatedStudent) {
  return {
    type: types.UPDATE_STUDENT_REQUEST,
    payload: updatedStudent,
  };
}

export function updateStudentSuccess(updatedStudent) {
  return {
    type: types.UPDATE_STUDENT_SUCCESS,
    payload: updatedStudent,
  };
}

export function updateStudentFailure(updatedStudent) {
  return {
    type: types.UPDATE_STUDENT_FAILURE,
    payload: updatedStudent,
  };
}

// DELETE STUDENT
export function deleteStudentRequest(id) {
  return {
    type: types.DELETE_STUDENT_REQUEST,
    payload: id,
  };
}

export function deleteStudentSuccess(id) {
  return {
    type: types.DELETE_STUDENT_SUCCESS,
    payload: id,
  };
}

export function deleteStudentFailure(id) {
  return {
    type: types.DELETE_STUDENT_FAILURE,
    payload: id,
  };
}
