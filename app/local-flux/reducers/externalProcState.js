import { fromJS } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/external-process-constants';

const initialState = fromJS({
    gethStatus: {},
    ipfsStatus: {}
});

const eProcState = createReducer(initialState, {
    [types.GET_GETH_STATUS_SUCCESS]: (state, action) => {
        return state.merge({ gethStatus: fromJS(action.status) });
    },
});

export default eProcState;

