import * as types from './types';

const initialState = {
  students: [],
  isLoading: false,
}

// eslint-disable-next-line
export default function (state = initialState, action) {
  switch (action.type) {
    // GET STUDENTS
    case types.GET_STUDENT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case types.GET_STUDENT_SUCCESS: {
      return {
        ...state,
        students: action.payload,
        isLoading: false,
      };
    }
    case types.GET_STUDENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // CREATE STUDENT
    case types.CREATE_STUDENT_REQUEST:
    case types.UPDATE_STUDENT_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case types.CREATE_STUDENT_SUCCESS:
    case types.UPDATE_STUDENT_SUCCESS: {
      const student = action.payload;
      const { students } = state;
      const exists = students.find(item => String(item.id) === String(student.id));
      let newStudents;

      if (exists) {
        newStudents = students.map(item =>
          String(item.id) === String(student.id) ? student : item
        );
      } else {
        newStudents = [...students, student];
      }

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
