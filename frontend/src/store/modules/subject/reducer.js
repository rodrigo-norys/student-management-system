import * as types from './types';

const initialState = {
  subjects: [],
  totalPages: 1,
  isLoading: false,
};

export default function subjectReducer(state = initialState, action) {
  switch (action.type) {
    // ================= REQUEST ================= //
    case types.GET_SUBJECTS_REQUEST:
    case types.CREATE_SUBJECT_REQUEST:
    case types.UPDATE_SUBJECT_REQUEST:
    case types.DELETE_SUBJECT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    // ================= FAILURE ================= //
    case types.GET_SUBJECTS_FAILURE:
    case types.CREATE_SUBJECT_FAILURE:
    case types.UPDATE_SUBJECT_FAILURE:
    case types.DELETE_SUBJECT_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    // ================= SUCCESS ================= //
    case types.GET_SUBJECTS_SUCCESS: {
      const payload = action.payload;

      if (payload && Array.isArray(payload.data)) {
        return {
          ...state,
          subjects: payload.data,
          totalPages: payload.totalPages || 1,
          isLoading: false,
        };
      }

      const subjectIndex = state.subjects.findIndex(
        (subject) => subject.id === payload.id,
      );
      const newSubjects = [...state.subjects];

      if (subjectIndex >= 0) {
        newSubjects[subjectIndex] = payload;
      } else {
        newSubjects.push(payload);
      }

      return {
        ...state,
        subjects: newSubjects,
        isLoading: false,
      };
    }

    case types.CREATE_SUBJECT_SUCCESS:
    case types.UPDATE_SUBJECT_SUCCESS: {
      const { id } = action.payload;
      const exists = state.subjects.some(
        (subject) => String(subject.id) === String(id),
      );

      const newSubjects = exists
        ? state.subjects.map((subject) =>
            String(subject.id) === String(id)
              ? { ...subject, ...action.payload }
              : subject,
          )
        : [...state.subjects, action.payload];

      return {
        ...state,
        subjects: newSubjects,
        isLoading: false,
      };
    }

    case types.DELETE_SUBJECT_SUCCESS: {
      const updatedSubjects = state.subjects.map((subject) =>
        String(subject.id) === String(action.payload)
          ? { ...subject, status: 'inactive' }
          : subject,
      );

      return {
        ...state,
        subjects: updatedSubjects,
        isLoading: false,
      };
    }

    default:
      return state;
  }
}
