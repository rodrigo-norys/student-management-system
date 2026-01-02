import * as types from '../types';

export function clickButtonRequest() {
  return {
    type: types.CLICKED_BUTTON_REQUEST
  };
}
export function clickButtonSuccess() {
  return {
    type: types.CLICKED_BUTTON_SUCCESS
  };
}
export function clickButtonFailure() {
  return {
    type: types.CLICKED_BUTTON_FAILURE
  };
}
