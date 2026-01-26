import * as types from './types';
import * as photoTypes from '../photo/types';

const initialState = {
  students: [],
  isLoading: false,
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
      const { id, name, last_name, email, age, weight, height } = action.payload;
      const { students } = state;
      const exists = students.find(student => String(student.id) === String(id));
      let newStudents;

      if (exists) {
        newStudents = students.map(newStudent =>
          String(newStudent.id) === String(id) ? { id, name, last_name, email, age, weight, height } : newStudent
        );
      } else {
        newStudents = [...students, { id, name, last_name, email, age, weight, height }];
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
      }
    }
    case types.DELETE_STUDENT_FAILURE: {
      return {
        ...state,
        isLoading: false,
      };
    }

    ///////////// UPDATE PHOTO /////////////
    case photoTypes.UPDATE_PHOTO_SUCCESS: {
      const { id, photo } = action.payload;
      const students = state.students;
      const studentsToNotUpdate = students.filter(student => String(student.id) !== String(id));
      
      const studentToUpdate = students.find(student => {
        if (String(student.id) === String(id)) {
          return {
            ...student,
            Photos: [{ url: photo }]
          }
        } else {
          return {
            students: [...students]
          }
        }
      });

      return {
        ...state,
        students: [...studentsToNotUpdate, { studentToUpdate }]
      }
    }

    default: {
      return state;
    }
  }
}
