import * as types from './types';

const initialState = {
  isLoading: false,
};

export default function photoReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_PHOTO_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case types.UPDATE_PHOTO_SUCCESS:
    case types.UPDATE_PHOTO_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default: {
      return state;
    }
  }
}
