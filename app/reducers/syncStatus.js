import * as types from '../constants/SyncConstants';
import { Map } from 'immutable';

const initialState = Map({
  currentState: 'Synchronising',
  action:       'PAUSE',
  actionId:     1,
  status:       [0]
});

export default function syncStatus (state = initialState, action) {

  switch (action.type) {
    case types.SYNC_ACTIVE:
      return state.merge({
        currentState: 'Synchronising',
        action:       'PAUSE',
        actionId:     1,
        status:       action.status
      });
    case types.SYNC_STOPPED:
      return state.merge({
        currentState: 'Synchronization was stopped',
        action:       'START',
        actionId:     2
      });
    case types.SYNC_FINISHED:
      return state.merge({
        currentState: 'Synchronization completed',
        action:       'COMPLETED',
        actionId:     3
      });
    default:
      return state;
  }
}
