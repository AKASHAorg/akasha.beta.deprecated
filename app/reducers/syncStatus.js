import * as types from '../constants/SyncConstants';
import { Map } from 'immutable';

const initialState = Map({
  currentState: 'Synchronising',
  message:      'Waiting for peers'
});

export default function syncStatus (state = initialState, action) {

  switch (action.type) {
    case types.SYNC_ACTIVE:
      return state.merge({
        currentState: 'Synchronising',
        message:      action.message
      });
    case types.SYNC_STOPPED:
      return state.merge({
        currentState: 'Synchronization was stopped',
        message:      action.message
      });
    case types.SYNC_FINISHED:
      return state.merge({
        currentState: 'Synchronization completed',
        message:      action.message
      });
    default:
      return state;
  }
}
