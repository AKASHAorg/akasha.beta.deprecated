
import * as types from '../constants/ProfileConstants';
import { fromJS } from 'immutable';

// Default "store" values
const initialState = fromJS({
  name:   { first: '', last: '', valid: false },
  user:   { value: '', valid:  false, err: '' },
  passwd: { pwd1: '', pwd2: '', valid:  false, err1: '', err2: '' },
  unlock: { value: 5, enabled: false },
  opt_details: false,
  create: { steps: ['...'], finished: false, address: '0x0', err: '' }
});

export default function profile (state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_NAME:
      return state.mergeDeep({ name: {
        first: action.first,
        last:  action.last
      }});
    case types.VALID_NAME:
      return state.setIn(['name', 'valid'], action.valid);

    case types.UPDATE_USER:
      return state.setIn(['user', 'value'], action.value);
    case types.VALID_USER:
      return state.mergeDeep({ user: {
        valid: action.valid,
        err:   action.err
      }});

    case types.UPDATE_PASSWD:
      return state.mergeDeep({ passwd: {
        pwd1: action.pwd1,
        pwd2: action.pwd2
      }});
    case types.VALID_PASSWD:
      return state.mergeDeep({ passwd: {
        valid: action.valid,
        err1:   action.err1,
        err2:   action.err2
      }});

    case types.UNLOCK_ENABLE:
      return state.setIn(['unlock', 'enabled'], action.enabled);
    case types.UNLOCK_ACCOUNT_FOR:
      return state.setIn(['unlock', 'value'], action.value);

    case types.TOGGLE_DETAILS:
      return state.set('opt_details', action.enabled);

    case types.CREATE_USER_PENDING:
      return state.updateIn(['create', 'steps'], list => list.push(action.step));
    case types.CREATE_ETH_ADDRESS:
      return state.setIn(['create', 'address'], action.address);
    case types.CREATE_USER_SUCCESS:
      return state.setIn(['create', 'finished'], true);
    case types.CREATE_USER_FAILURE:
      return state.setIn(['create', 'err'], action.err);

    default:
      return state;
  }
}
