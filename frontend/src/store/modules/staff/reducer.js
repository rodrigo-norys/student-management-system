import * as types from './types';
import * as photoTypes from '../photo/types';

const initialState = {
  staff: [],
  isLoading: false,
  addressSuggestion: null,
};

export default function staffReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_STAFF_REQUEST:
    case types.CREATE_STAFF_REQUEST:
    case types.UPDATE_STAFF_REQUEST:
    case types.DELETE_STAFF_REQUEST:
    case types.GET_CEP_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case types.GET_STAFF_FAILURE:
    case types.CREATE_STAFF_FAILURE:
    case types.UPDATE_STAFF_FAILURE:
    case types.DELETE_STAFF_FAILURE:
    case types.GET_CEP_FAILURE:
      return {
        ...state,
        isLoading: false,
        addressSuggestion: null
      };

    case types.GET_STAFF_SUCCESS: {
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          staff: action.payload,
          isLoading: false
        };
      }

      const staffIndex = state.staff.findIndex(item =>
        item.id === action.payload.id
      );

      let newStaff = [...state.staff];

      if (staffIndex >= 0) {
        newStaff[staffIndex] = action.payload;
      } else {
        newStaff.push(action.payload);
      }

      return {
        ...state,
        staff: newStaff,
        isLoading: false
      };
    }

    case types.CREATE_STAFF_SUCCESS:
    case types.UPDATE_STAFF_SUCCESS: {
      const { id } = action.payload;
      const exists = state.staff.some(item =>
        String(item.id) === String(id)
      );

      const newStaff = exists
        ? state.staff.map(item =>
            String(item.id) === String(id)
              ? { ...item, ...action.payload }
              : item
          )
        : [...state.staff, action.payload];

      return {
        ...state,
        staff: newStaff,
        isLoading: false,
      };
    }

    case types.DELETE_STAFF_SUCCESS: {
      return {
        ...state,
        staff: state.staff.filter(item =>
          item.id !== (action.payload.id || action.payload)
        ),
        isLoading: false,
      };
    }

    case photoTypes.UPDATE_PHOTO_SUCCESS: {
      const { avatar_url, staffId } = action.payload;
      return {
        ...state,
        staff: state.staff.map(item =>
          String(item.id) === String(staffId)
            ? { ...item, avatar_url }
            : item
        ),
      };
    }

    case types.GET_CEP_SUCCESS: {
      return {
        ...state,
        addressSuggestion: action.payload,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
