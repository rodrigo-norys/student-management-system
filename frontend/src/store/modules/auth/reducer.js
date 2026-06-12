import * as types from './types';

const initialState = {
  isCheckingSession: true,
  isLoading: false,
  isLoggedIn: false,
  isPowerUser: false,
  isDemo: false,
  user: {},
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    ///////////// LOGIN /////////////
    case types.LOGIN_REQUEST:
    case types.DEMO_LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case types.LOGIN_SUCCESS: {
      const { user } = action.payload;
      return {
        ...state,
        user,
        isLoggedIn: true,
        isPowerUser: user.access_level_id <= 2,
        isDemo: !!user.is_demo,
        isLoading: false,
        isCheckingSession: false,
      };
    }

    case types.LOGIN_FAILURE: {
      return {
        ...initialState,
        isLoading: false,
        isCheckingSession: false,
      };
    }

    ///////////// LOGOUT /////////////
    case types.LOGOUT_SUCCESS: {
      return {
        ...initialState,
        isCheckingSession: false,
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
          access_level: action.payload.access_level,
        };
        newState.isPowerUser =
          action.payload.access_level?.manage_account === 1 ||
          action.payload.access_level_id <= 2;
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
