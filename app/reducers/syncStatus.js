import * as types from '../constants/SyncConstants';
import { fromJS } from 'immutable';

const initialState = fromJS({
    actionId: 1
});

export default function syncStatus (state = initialState, action) {
    switch (action.type) {
        case types.SYNC_ACTIVE:
            return state.merge({
                actionId: 1,
            });
        case types.SYNC_STOPPED:
            return state.merge({
                actionId: 2
            });
        case types.SYNC_FINISHED:
            return state.merge({
                actionId: 3
            });
        default:
            return state;
    }
}
