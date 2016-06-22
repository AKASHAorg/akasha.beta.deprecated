import * as types from '../constants/ProfileConstants';
import { fromJS, List, Map } from 'immutable';

const initialState = fromJS({
    profiles: List(),
    loggedProfile: Map(),
    newProfile: Map(),
    messages: ''
});


export default function profileState (state = initialState, action) {
    switch (action.type) {
        case types.GET_PROFILES_LIST_SUCCESS:
            return state.merge({ profiles: action.profiles });
        case types.GET_PROFILES_LIST_ERROR:
            return state.merge({ profiles: [], messages: action.message });
        case types.GET_TEMP_PROFILE_SUCCESS:
            return state.merge({ newProfile: action.profile[0] });
        case types.CREATE_ETH_ADDRESS_SUCCESS:
            return state.setIn(['newProfile', 'profileData', 'address'], () => action.data.status);
        case types.FUND_FROM_FAUCET_START:
            return state.setIn(['newProfile', 'stepStatus'], () => 'pending');
        case types.FUND_FROM_FAUCET_SUCCESS:
            return state.setIn(['newProfile', '']);
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
