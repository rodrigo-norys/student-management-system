import * as types from './types';

export function updatePhotoRequest(updatedPhoto) {
  return {
    type: types.UPDATE_PHOTO_REQUEST,
    payload: updatedPhoto,
  };
}

export function updatePhotoSuccess(updatedPhoto) {
  return {
    types: types.UPDATE_PHOTO_SUCCESS,
    payload: updatedPhoto,
  };
}

export function updatePhotoFailure(updatedPhoto) {
  return {
    type: types.UPDATE_PHOTO_FAILURE,
    payload: updatedPhoto,
  };
}
