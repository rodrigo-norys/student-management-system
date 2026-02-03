import * as types from './types';

const initialState = {
  isLoggedIn: false,
  token: false,
  user: {},
  isLoading: false
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
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        user: action.payload.user,
        isLoading: false,
      };
    }

    case types.LOGIN_FAILURE: {
      return {
        ...state,
        isLoggedIn: false,
        isLoading: false,
        user: {},
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
      return {
        ...state,
        user: {
          name: action.payload.name,
          email: action.payload.email,
        },
        isLoading: false,
      };
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
