import * as types from './types';

const initialState = {
  units: [],
  totalPages: 1,
  isLoading: false,
};

export default function unitReducer(state = initialState, action) {
  switch (action.type) {
    // ================= REQUEST ================= //
    case types.GET_UNITS_REQUEST:
    case types.CREATE_UNIT_REQUEST:
    case types.UPDATE_UNIT_REQUEST:
    case types.DELETE_UNIT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    // ================= FAILURE ================= //
    case types.GET_UNITS_FAILURE:
    case types.CREATE_UNIT_FAILURE:
    case types.UPDATE_UNIT_FAILURE:
    case types.DELETE_UNIT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    // ================= SUCCESS ================= //
    case types.GET_UNITS_SUCCESS: {
      const payload = action.payload;

      if (payload && Array.isArray(payload.data)) {
        return {
          ...state,
          units: payload.data,
          totalPages: payload.totalPages || 1,
          isLoading: false,
        };
      }

      const unitIndex = state.units.findIndex((unit) => unit.id === payload.id);
      const newUnits = [...state.units];

      if (unitIndex >= 0) {
        newUnits[unitIndex] = payload;
      } else {
        newUnits.push(payload);
      }

      return {
        ...state,
        units: newUnits,
        isLoading: false,
      };
    }

    case types.CREATE_UNIT_SUCCESS:
    case types.UPDATE_UNIT_SUCCESS: {
      const { id } = action.payload;
      const exists = state.units.some((unit) => String(unit.id) === String(id));

      const newUnits = exists
        ? state.units.map((unit) =>
            String(unit.id) === String(id)
              ? { ...unit, ...action.payload }
              : unit,
          )
        : [...state.units, action.payload];

      return {
        ...state,
        units: newUnits,
        isLoading: false,
      };
    }

    case types.DELETE_UNIT_SUCCESS: {
      const updatedUnits = state.units.map((unit) =>
        String(unit.id) === String(action.payload)
          ? { ...unit, status: 'inactive' }
          : unit,
      );

      return {
        ...state,
        units: updatedUnits,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
