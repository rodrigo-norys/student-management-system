import * as types from './types';

// LOGIN
export function loginRequest(payload) {
  return {
    type: types.LOGIN_REQUEST,
    payload,
  };
}

export function loginSuccess(payload) {
  return {
    type: types.LOGIN_SUCCESS,
    payload,
  };
}

export function loginFailure(payload) {
  return {
    type: types.LOGIN_FAILURE,
    payload,
  };
}

// Login one-click da demo: sem credenciais no front, o backend resolve o
// usuário demo conhecido em POST /tokens/demo.
export function demoLoginRequest() {
  return {
    type: types.DEMO_LOGIN_REQUEST,
  };
}

// VALIDATE SESSION
export function validateSessionRequest() {
  return {
    type: types.VALIDATE_SESSION_REQUEST,
  };
}

// REGISTER
export function registerRequest(payload) {
  return {
    type: types.REGISTER_REQUEST,
    payload,
  };
}

export function registerUpdatedSuccess(payload) {
  return {
    type: types.REGISTER_UPDATED_SUCCESS,
    payload,
  };
}

export function registerCreatedSuccess(payload) {
  return {
    type: types.REGISTER_CREATED_SUCCESS,
    payload,
  };
}

export function registerFailure(payload) {
  return {
    type: types.REGISTER_FAILURE,
    payload,
  };
}

// LOGOUT
export function logoutRequest() {
  return {
    type: types.LOGOUT_REQUEST,
  };
}

export function logoutSuccess() {
  return {
    type: types.LOGOUT_SUCCESS,
  };
}
