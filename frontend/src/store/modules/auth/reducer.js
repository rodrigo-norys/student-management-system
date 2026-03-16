import * as types from './types';

const initialState = {
  isLoggedIn: false,
  token: false,
  user: {},
  isLoading: false,
  isPowerUser: false
};

// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    ///////////// LOGIN /////////////
    case types.LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
      }
    }

    case types.LOGIN_SUCCESS: {
      const { user } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        user,
        isPowerUser: user.access_level_id <= 2,
        isLoading: false,
      };
    }

    case types.LOGIN_FAILURE: {
      return {
        ...state,
        user: {},
        isLoggedIn: false,
        isLoading: false,
        isPowerUser: false,
      };
    }

    ///////////// REGISTER /////////////
    case types.REGISTER_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case types.REGISTER_UPDATED_SUCCESS: {
      const newState = { ...state };

      if (action.payload.id === newState.user.id) {
        newState.user = {
          ...newState.user,
          email: action.payload.email,
          access_level_id: action.payload.access_level_id,
        };

        newState.isPowerUser = action.payload.access_level_id <= 2;
      }

      newState.isLoading = false;
      return newState;
    }

    case types.REGISTER_CREATED_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case types.REGISTER_FAILURE: {
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
