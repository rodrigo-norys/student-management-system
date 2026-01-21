import * as types from './types';

export function getPhotoRequest(photo) {
  return {
    type: types.GET_PHOTO_REQUEST,
    payload: photo,
  };
}

export function getPhotoSuccess(photo) {
  return {
    type: types.GET_PHOTO_SUCCESS,
    payload: photo,
  };
}

export function getPhotoFailure(photo) {
  return {
    type: types.GET_PHOTO_FAILURE,
    payload: photo,
  };
}

export function updatePhotoRequest(updatedPhoto) {
  return {
    type: types.UPDATE_PHOTO_REQUEST,
    payload: updatedPhoto,
  };
}

export function updatePhotoSuccess(updatedPhoto) {
  return {
    type: types.UPDATE_PHOTO_SUCCESS,
    payload: updatedPhoto,
  };
}

export function updatePhotoFailure(updatedPhoto) {
  return {
    type: types.UPDATE_PHOTO_FAILURE,
    payload: updatedPhoto,
  };
}
