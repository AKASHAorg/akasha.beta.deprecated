import * as types from '../constants/AuthConstants';
import { fromJS } from 'immutable';

const initialState = fromJS({
  profiles: [],
  authAddress: false,
  authUser: false,
  authTime: false,
  authorized: false,
  message: false
});


export default function authState(state = initialState, action) {

  switch (action.type) {
    case types.LOCAL_PROFILES_FOUND:
      return state.merge({ profiles: action.data });
    case types.LOCAL_PROFILES_NONE:
      return state.merge({ profiles: [], message: action.message });
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
