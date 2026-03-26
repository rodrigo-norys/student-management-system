import * as types from './types';

export function updatePhotoRequest(payload) {
  return {
    type: types.UPDATE_PHOTO_REQUEST,
    payload,
  };
}

export function updatePhotoSuccess(payload) {
  return {
    type: types.UPDATE_PHOTO_SUCCESS,
    payload,
  };
}

export function updatePhotoFailure(payload) {
  return {
    type: types.UPDATE_PHOTO_FAILURE,
    payload,
  };
}
