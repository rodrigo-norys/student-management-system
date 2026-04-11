import * as types from './types';
import * as photoTypes from '../photo/types';

const initialState = {
  staff: [],
  isLoading: false,
  addressSuggestion: null,
};

export default function staffReducer(state = initialState, action) {
  switch (action.type) {

    // ================= REQUEST ================= //
    case types.GET_STAFF_REQUEST:
    case types.CREATE_STAFF_REQUEST:
    case types.UPDATE_STAFF_REQUEST:
    case types.DELETE_STAFF_REQUEST:
    case types.GET_CEP_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    // ================= FAILURE ================= //
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

    // ================= SUCCESS ================= //
    case types.GET_STAFF_SUCCESS: {
      const payload = action.payload;
      if (payload && Array.isArray(payload.data)) {
        return {
          ...state,
          staff: payload.data,
          totalPages: payload.totalPages || 1,
          isLoading: false
        };
      }

      if (Array.isArray(payload)) {
        return {
          ...state,
          staff: payload,
          isLoading: false
        };
      }

      const staffIndex = state.staff.findIndex(staff => staff.id === payload.id);
      let newStaff = [...state.staff];

      staffIndex >= 0
        ? newStaff[staffIndex] = payload
        : newStaff.push(payload);

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
            : item)
        : [...state.staff, action.payload];

      return {
        ...state,
        staff: newStaff,
        isLoading: false,
      };
    }

    case types.DELETE_STAFF_SUCCESS: {
      const updatedStaff = state.staff.map((staff) => {
        if (staff.id === action.payload) {
          return {
            ...staff,
            isLoading: false,
            is_active: 'inactive',
          };
        }
        return staff;
      });

      return {
        ...state,
        staff: updatedStaff,
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
