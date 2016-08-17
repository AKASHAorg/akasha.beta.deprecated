import * as types from '../constants/external-process-constants';
import { fromJS } from 'immutable';
import { createReducer } from './create-reducer';

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

