import * as types from '../constants/SyncConstants';
import { fromJS } from 'immutable';

const initialState = fromJS({
  currentState: 'Synchronising',
  action: 'PAUSE',
  actionId: 1,
  status: [0]
});

export default function syncStatus (state = initialState, action) {

  switch (action.type) {
    case types.SYNC_ACTIVE:
      return state.merge({
        currentState: 'Synchronising',
        action: 'PAUSE',
        actionId: 1,
      });
    case types.SYNC_STOPPED:
      return state.merge({
        currentState: 'Synchronization was stopped',
        action: 'START',
        actionId: 2
      });
    case types.SYNC_FINISHED:
      return state.merge({
        currentState: 'Synchronization completed',
        action: 'COMPLETED',
        actionId: 3
      });
    case types.SYNC_RESUME:
      return state.merge({
        currentState: 'Resuming synchronization...',
        action: 'STARTING...',
        actionId: 4
      });
    default:
      return state;
  }
}
