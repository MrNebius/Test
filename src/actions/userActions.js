import {USER_REQUEST, USER_SUCCESS, LOGOUT_USER, USER_FAILURE} from '../constants/constants'
const request = require('superagent');

export function Request() {
  return {
    type: USER_REQUEST
  }
}

export function authSuccess(token, text) {
  localStorage.setItem('token', token);
  return {
    type: USER_SUCCESS,
    message: text
  }
}

export function authFailure(text) {
  return {
    type: USER_FAILURE,
    message: text
  }
}

export function authUser(creds) {
  return function (dispatch) {
    dispatch(Request());
    return request.post('http://localhost:8080/auth')
      .send(creds)
      .end((err, res) => {
        if (!err) {
          dispatch(authSuccess(res.body.token, 'You are logged'))

        } else {
          dispatch(authFailure('Wrong password or username'))
        }
      });
  }
}

export function createNewUser(creds) {
  return function (dispatch) {
    dispatch(Request());
    return request.post('http://localhost:8080/auth/new')
      .send(creds)
      .end((err, res) => {
        if (!err) {
          dispatch(authSuccess(res.body.token, 'Create success'))

        } else {
          dispatch(authFailure('This username already used'))
        }
      });
  }
}

export function logout() {
  localStorage.removeItem('token');
  return {
    type: LOGOUT_USER
  }
}

export function verifyUser() {
  return function (dispatch) {
    return request.get('http://localhost:8080/auth')
      .set('token', localStorage.token)
      .end((err, res) => {
        if (err) {
        } else if (!err && res.body.success) {
          dispatch(authSuccess(res.body.token, 'You are logged'))
        } else if (!res.body.success) {
          dispatch(logout())
        }
      });
  }
}