import {
  ADD_STUDENT,
  ADD_STUDENT_SUCCESS,
  ADD_STUDENT_FAIL,
  UPDATE_STUDENT,
  UPDATE_STUDENT_SUCCESS,
  UPDATE_STUDENT_FAIL,
  DELETE_STUDENT,
  DELETE_STUDENT_SUCCESS,
  DELETE_STUDENT_FAIL,
} from "../constants/student";

const initialState = {
  isLoading: false,
  msg: null,
  flag: false,
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_STUDENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case ADD_STUDENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: true,
      };
    }
    case ADD_STUDENT_FAIL: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: false,
      };
    }
    case UPDATE_STUDENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case UPDATE_STUDENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: true,
      };
    }
    case UPDATE_STUDENT_FAIL: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: false,
      };
    }
    case DELETE_STUDENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case DELETE_STUDENT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
      };
    }
    case DELETE_STUDENT_FAIL: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
      };
    }
    default:
      return state;
  }
};

export default studentReducer;
