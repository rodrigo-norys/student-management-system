import * as types from './types';

const initialState = {
  unitClasses: [],
  unitOptions: [],
  totalPages: 1,
  isLoading: false,
};

export default function unitClassReducer(state = initialState, action) {
  switch (action.type) {
    // ================= REQUEST ================= //
    case types.GET_UNIT_CLASSES_REQUEST:
    case types.CREATE_UNIT_CLASS_REQUEST:
    case types.UPDATE_UNIT_CLASS_REQUEST:
    case types.DELETE_UNIT_CLASS_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    // ================= FAILURE ================= //
    case types.GET_UNIT_CLASSES_FAILURE:
    case types.CREATE_UNIT_CLASS_FAILURE:
    case types.UPDATE_UNIT_CLASS_FAILURE:
    case types.DELETE_UNIT_CLASS_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    // ================= SUCCESS ================= //
    case types.GET_UNIT_CLASSES_SUCCESS: {
      const payload = action.payload;

      if (payload && Array.isArray(payload.data)) {
        return {
          ...state,
          unitClasses: payload.data,
          totalPages: payload.totalPages || 1,
          isLoading: false,
        };
      }

      const classIndex = state.unitClasses.findIndex(
        (unitClass) => unitClass.id === payload.id,
      );
      const newUnitClasses = [...state.unitClasses];

      if (classIndex >= 0) {
        newUnitClasses[classIndex] = payload;
      } else {
        newUnitClasses.push(payload);
      }

      return {
        ...state,
        unitClasses: newUnitClasses,
        isLoading: false,
      };
    }

    case types.CREATE_UNIT_CLASS_SUCCESS:
    case types.UPDATE_UNIT_CLASS_SUCCESS: {
      const { id } = action.payload;
      const exists = state.unitClasses.some(
        (unitClass) => String(unitClass.id) === String(id),
      );

      const newUnitClasses = exists
        ? state.unitClasses.map((unitClass) =>
            String(unitClass.id) === String(id)
              ? { ...unitClass, ...action.payload }
              : unitClass,
          )
        : [...state.unitClasses, action.payload];

      return {
        ...state,
        unitClasses: newUnitClasses,
        isLoading: false,
      };
    }

    case types.DELETE_UNIT_CLASS_SUCCESS: {
      const updatedUnitClasses = state.unitClasses.map((unitClass) =>
        String(unitClass.id) === String(action.payload)
          ? { ...unitClass, status: 'inactive' }
          : unitClass,
      );

      return {
        ...state,
        unitClasses: updatedUnitClasses,
        isLoading: false,
      };
    }

    // ================= UNIT OPTIONS ================= //
    case types.GET_UNIT_OPTIONS_SUCCESS:
      return {
        ...state,
        unitOptions: Array.isArray(action.payload) ? action.payload : [],
      };

    case types.GET_UNIT_OPTIONS_FAILURE:
      return {
        ...state,
        unitOptions: [],
      };

    default:
      return state;
  }
}
