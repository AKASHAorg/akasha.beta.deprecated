import * as types from '../constants/SyncConstants';
import { createReducer } from './create-reducer';
import { fromJS } from 'immutable';

const initialState = fromJS({
    actionId: 1
});

const syncStatus =  createReducer(initialState, {
    [types.SYNC_ACTIVE]: (state, action) => {
        return state.merge({
            actionId: 1,
        });
    },
    [types.SYNC_STOPPED]: (state, action) => {
        return state.merge({
            actionId: 2
        });
    },
    [types.SYNC_FINISHED]: (state, action) => {
        return state.merge({
            actionId: 3
        });
    },
});

export default syncStatus;
