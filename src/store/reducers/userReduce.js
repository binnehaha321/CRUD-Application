import {
  ADD_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  STORE_DEPARTMENT_LIST,
  STORE_ROLE_LIST,
} from "../constants/user";

const initialState = {
  isLoading: false,
  msg: null,
  flag: false,
  departments: [],
  roles: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER: {
      return {
        ...state,
        isLoading: true,
        msg: "",
      };
    }
    case ADD_USER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: true,
      };
    }
    case ADD_USER_FAIL: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: false,
      };
    }
    case UPDATE_USER: {
      return {
        ...state,
        isLoading: true,
        msg: "",
      };
    }
    case UPDATE_USER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: true,
      };
    }
    case UPDATE_USER_FAIL: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: false,
      };
    }
    case DELETE_USER: {
      return {
        ...state,
        isLoading: true,
        msg: "",
      };
    }
    case DELETE_USER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: true,
      };
    }
    case DELETE_USER_FAIL: {
      return {
        ...state,
        isLoading: false,
        msg: action.payload,
        flag: false,
      };
    }
    case STORE_DEPARTMENT_LIST: {
      return {
        ...state,
        departments: action.payload,
      };
    }
    case STORE_ROLE_LIST: {
      return {
        ...state,
        roles: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
