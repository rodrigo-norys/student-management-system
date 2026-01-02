import * as types from './types';
import axios from '../../../services/axios';

const initialState = {
  isLoggedIn: false,
  token: false,
  user: {},
  isLoading: false
};

// eslint-disable-next-line
export default function (state = initialState, action) {
  if (action.type === types.LOGIN_SUCCESS) {
    const newState = { ...state };
    newState.isLoggedIn = true;
    newState.token = action.payload.token;
    newState.user = action.payload.user;
    newState.isLoading = false;

    return newState;
  }
  if (action.type === types.LOGIN_FAILURE) {
    delete axios.defaults.headers.Authorization;
    const newState = { ...initialState };
    return newState;
  }
  if (action.type === types.LOGIN_REQUEST) {
    const newState = { ...state };
    newState.isLoading = true;
    return newState;
  }
  if (action.type === types.REGISTER_UPDATED_SUCCESS) {
    const newState = { ...state };
    newState.user = {
      ...newState.user,
      name: action.payload.name,
      email: action.payload.email,
    }
    newState.isLoading = false;
    return newState;
  }
  if (action.type === types.REGISTER_CREATED_SUCCESS) {
    const newState = { ...state };
    newState.isLoading = false;
    return newState;
  }
  if (action.type === types.REGISTER_FAILURE) {
    const newState = { ...state };
    newState.isLoading = false;
    return newState;
  }
  if (action.type === types.REGISTER_REQUEST) {
    const newState = { ...state };
    newState.isLoading = true;
    return newState;
  }
  return state;
}
