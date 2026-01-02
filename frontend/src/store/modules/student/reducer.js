import * as types from './types';

const initialState = {
  students: [],
  isLoading: false,
}

// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    // GET STUDENTS
    case types.GET_STUDENTS_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case types.GET_STUDENTS_SUCCESS: {
      return {
        ...state,
        students: action.payload,
        isLoading: false,
      };
    }
    case types.GET_STUDENTS_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // CREATE STUDENT
    case types.CREATE_STUDENT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case types.CREATE_STUDENT_SUCCESS: {
      return {
        ...state,
        students: [...state.students, action.payload],
        isLoading: false,
      };
    }
    case types.CREATE_STUDENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // DELETE STUDENT
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
      }
    }
    case types.DELETE_STUDENT_FAILURE: {
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
