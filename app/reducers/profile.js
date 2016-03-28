import * as types from '../constants/ProfileConstants';
import { Map } from 'immutable';

const initialState = Map({
  name: '',
  user: '',
  passwd: ''
});

export default function profile (state = initialState, action) {

  switch (action.type) {
    case types.UPDATE_NAME:
      return state.merge({ name: action.text });
    case types.UPDATE_USER:
      return state.merge({ user: action.text });
    case types.UPDATE_PASSWD:
      return state.merge({ passwd: action.text });

    default:
      return state;
  }
}
