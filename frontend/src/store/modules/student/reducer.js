import * as types from './types';
import * as photoTypes from '../photo/types';

const initialState = {
  students: [],
  isLoading: false,
  addressSuggestion: null,
}

// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    ///////////// GET STUDENTS /////////////
    case types.GET_STUDENTS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case types.GET_STUDENTS_SUCCESS: {
      const newState = { ...state };

      if (Array.isArray(action.payload)) {
        newState.students = action.payload;
      } else {
        const studentIndex = newState.students.findIndex(
          (student) => student.id === action.payload.id
        );

        if (studentIndex >= 0) {
          newState.students[studentIndex] = action.payload;
        } else {
          newState.students.push(action.payload);
        }
      }
      newState.isLoading = false;
      return newState;
    }
    case types.GET_STUDENTS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    ///////////// CREATE STUDENT /////////////
    case types.CREATE_STUDENT_REQUEST:
    case types.UPDATE_STUDENT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case types.CREATE_STUDENT_SUCCESS:
    case types.UPDATE_STUDENT_SUCCESS: {
      const { id } = action.payload;
      const { students } = state;
      const exists = students.some(student => String(student.id) === String(id));

      const newStudents = exists
        ? students.map(student => String(student.id) === String(id)
          ? { ...student, ...action.payload }
          : student
        )
        : [...students, action.payload];

      return {
        ...state,
        students: newStudents,
        isLoading: false,
      };
    }

    case types.CREATE_STUDENT_FAILURE:
    case types.UPDATE_STUDENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    ///////////// DELETE STUDENT /////////////
    case types.DELETE_STUDENT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case types.DELETE_STUDENT_SUCCESS: {
      const studentId = action.payload;
      return {
        ...state,
        students: state.students.filter(
          (student) => student.id !== studentId
        ),
        isLoading: false,
      };
    }
    case types.DELETE_STUDENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    ///////////// UPDATE PHOTO /////////////
    case photoTypes.UPDATE_PHOTO_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case photoTypes.UPDATE_PHOTO_SUCCESS: {
      const { id, photo } = action.payload;

      return {
        ...state,
        students: state.students.map((student) => {
          if (String(student.id) === String(id)) {
            return {
              ...student,
              avatar_url: photo,
            };
          }
          return student;
        }),
        isLoading: false,
      };
    }

    case types.GET_CEP_REQUEST: {
      const newState = { ...state };
      newState.isLoading = true;
      return newState;
    }

    case types.GET_CEP_SUCCESS: {
      const newState = { ...state };
      newState.addressSuggestion = action.payload;
      newState.isLoading = false;
      return newState;
    }

    case types.GET_CEP_FAILURE: {
      const newState = { ...state };
      newState.isLoading = false;
      newState.addressSuggestion = null;
      return newState;
    }

    default: {
      return state;
    }
  }
}
