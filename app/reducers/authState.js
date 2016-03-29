import * as types from '../constants/AuthConstants';
import { Map } from 'immutable';

const initialState = Map({
  authAddress: false,
  authUser:    false,
  authTime:    false,
  authorized:  false,
  message:     false
});


export default function authState (state = initialState, action) {

  switch (action.type) {
    case types.AUTH_LOGIN:
      return state.merge({
        authAddress: 'stub'
      });
    case types.AUTH_LOGIN_SUCCESS:
      return state.merge({
        authAddress: 'stub'
      });
    case types.AUTH_LOGIN_FAILURE:
      return state.merge({
        authAddress: 'stub'
      });
    default:
      return state;
  }
}
