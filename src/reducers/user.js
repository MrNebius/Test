import {USER_REQUEST, USER_SUCCESS, LOGOUT_USER, USER_FAILURE} from '../constants/constants.js'

const initialState = {
  isAuthenticated: localStorage.token ? true : false,
  isAuthenticating: false,
  message:localStorage.token ? 'You are logged' : ''
};

export default function updateUser(state = initialState, action) {
  switch (action.type) {

    case USER_REQUEST:
      return {
        ...state,
        isAuthenticating: true
      };

    case USER_SUCCESS:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: true,
        message: action.message
      };

    case USER_FAILURE:
      return {
        ...state,
        isAuthenticating: false,
        isAuthenticated: false,
        message: action.message
      };

    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        message: ''
      };

    default:
      return state;
  }
}