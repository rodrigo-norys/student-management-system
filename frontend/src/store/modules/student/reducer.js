import * as types from './types';
import * as photoTypes from '../photo/types';

const initialState = {
  students: [],
  isLoading: false,
  addressSuggestion: null,
}

export default function studentReducer(state = initialState, action) {
  switch (action.type) {

    // ================= REQUEST ================= //
    case types.GET_STUDENTS_REQUEST:
    case types.CREATE_STUDENT_REQUEST:
    case types.UPDATE_STUDENT_REQUEST:
    case types.DELETE_STUDENT_REQUEST:
    case types.GET_CEP_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    // ================= FAILURE ================= //
    case types.GET_STUDENTS_FAILURE:
    case types.CREATE_STUDENT_FAILURE:
    case types.UPDATE_STUDENT_FAILURE:
    case types.DELETE_STUDENT_FAILURE:
    case types.GET_CEP_FAILURE:
      return {
        ...state,
        isLoading: false,
        addressSuggestion: null
      };

    // ================= SUCCESS ================= //
    case types.GET_STUDENTS_SUCCESS: {
      const payload = action.payload;
      if (payload && Array.isArray(payload.data)) {
        return {
          ...state,
          students: payload.data,
          totalPages: payload.totalPages || 1,
          isLoading: false
        };
      }

      if (Array.isArray(payload)) {
        return {
          ...state,
          students: payload,
          isLoading: false
        };
      }

      const studentIndex = state.students.findIndex(student => student.id === payload.id);
      let newStudents = [...state.students];

      studentIndex >= 0
        ? newStudents[studentIndex] = payload
        : newStudents.push(payload);

      return {
        ...state,
        students: newStudents,
        isLoading: false
      };
    }

    case types.CREATE_STUDENT_SUCCESS:
    case types.UPDATE_STUDENT_SUCCESS: {
      const { id } = action.payload;
      const exists = state.students.some(student =>
        String(student.id) === String(id)
      );

      const newStudents = exists
        ? state.students.map(student =>
          String(student.id) === String(id)
            ? { ...student, ...action.payload }
            : student)
        : [...state.students, action.payload];

      return {
        ...state,
        students: newStudents,
        isLoading: false,
      };
    }

    case types.DELETE_STUDENT_SUCCESS: {
      const updatedStudents = state.students.map((student) => {
        if (student.id === action.payload) {
          return {
            ...student,
            isLoading: false,
            status: 'inactive',
          };
        }
        return student;
      });

      return {
        ...state,
        students: updatedStudents,
        isLoading: false,
      };
    }

    case photoTypes.UPDATE_PHOTO_SUCCESS: {
      const { avatar_url, studentId } = action.payload;
      return {
        ...state,
        students: state.students.map(student =>
          String(student.id) === String(studentId)
            ? { ...student, avatar_url }
            : student
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
