import {LOGIN, LOGOUT} from '../constants'

export function setLogIn (a) {
  return {
    type: LOGIN,
    logged: a
  }
}

export function setLogOut (a)  {
  return {
    type: LOGOUT,
    logged: a
  }
}