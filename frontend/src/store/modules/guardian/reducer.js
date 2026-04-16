import * as types from './types';
import * as photoTypes from '../photo/types';

const initialState = {
  guardians: [],
  isLoading: false,
  addressSuggestion: null,
};

export default function guardianReducer(state = initialState, action) {
  switch (action.type) {
    // ================= REQUEST ================= //
    case types.GET_GUARDIANS_REQUEST:
    case types.CREATE_GUARDIAN_REQUEST:
    case types.UPDATE_GUARDIAN_REQUEST:
    case types.DELETE_GUARDIAN_REQUEST:
    case types.GET_CEP_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    // ================= FAILURE ================= //
    case types.GET_GUARDIANS_FAILURE:
    case types.CREATE_GUARDIAN_FAILURE:
    case types.UPDATE_GUARDIAN_FAILURE:
    case types.DELETE_GUARDIAN_FAILURE:
    case types.GET_CEP_FAILURE:
      return {
        ...state,
        isLoading: false,
        addressSuggestion: null,
      };

      // ================= SUCCESS ================= //
    case types.GET_GUARDIANS_SUCCESS: {
      const payload = action.payload;

      if (payload && Array.isArray(payload.data)) {
        return {
          ...state,
          guardians: payload.data,
          totalPages: payload.totalPages || 1,
          isLoading: false,
        };
      }

      if (Array.isArray(payload)) {
        return {
          ...state,
          guardians: payload,
          isLoading: false,
        };
      }

      const guardianIndex = state.guardians.findIndex((guardian) => guardian.id === payload.id);
      let newGuardians = [...state.guardians];

      guardianIndex >= 0
        ? (newGuardians[guardianIndex] = payload)
        : newGuardians.push(payload);

      return {
        ...state,
        guardians: newGuardians,
        isLoading: false,
      };
    }

    case types.CREATE_GUARDIAN_SUCCESS:
    case types.UPDATE_GUARDIAN_SUCCESS: {
      const { id } = action.payload;
      const exists = state.guardians.some((guardian) => String(guardian.id) === String(id));

      const newGuardians = exists
        ? state.guardians.map((guardian) =>
          String(guardian.id) === String(id) ? { ...guardian, ...action.payload } : guardian
        )
        : [...state.guardians, action.payload];

      return {
        ...state,
        guardians: newGuardians,
        isLoading: false,
      };
    }

    case types.DELETE_GUARDIAN_SUCCESS: {
      const updatedGuardians = state.guardians.map((guardian) => {
        if (guardian.id === action.payload) {
          return {
            ...guardian,
            isLoading: false,
            is_active: 'inactive',
          };
        }
        return guardian;
      });

      return {
        ...state,
        guardians: updatedGuardians,
        isLoading: false,
      };
    }

    // ================= PHOTO ================= //
    case photoTypes.UPDATE_PHOTO_SUCCESS: {
      const { avatar_url, guardianId } = action.payload;
      return {
        ...state,
        guardians: state.guardians.map((guardian) =>
          String(guardian.id) === String(guardianId) ? { ...guardian, avatar_url } : guardian
        ),
      };
    }

    // ================= CEP ================= //
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
