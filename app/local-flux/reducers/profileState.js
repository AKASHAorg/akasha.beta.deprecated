import * as types from '../constants/ProfileConstants';
import { createReducer } from './create-reducer';
import { fromJS, List, Map } from 'immutable';

const initialState = fromJS({
    profiles: List(),
    loggedProfile: Map(),
    tempProfile: Map({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        password2: '',
        address: '',
        optionalData: {
            avatar: {},
            backgroundImage: [],
            about: '',
            links: []
        },
        currentStatus: {
            currentStep: '',
            status: '',
            message: '',
            faucetRequested: false
        }
    })
});

const profileState = createReducer(initialState, {
    [types.LOGIN_SUCCESS]: (state, action) => {
        return state.merge({ loggedProfile: action.profileData });
    },
    [types.GET_PROFILES_LIST_SUCCESS]: (state, action) => {
        return state.merge({ profiles: fromJS(action.profiles) });
    },
    [types.GET_PROFILES_LIST_ERROR]: (state, action) => {
        return state.merge({ profiles: [], messages: action.message });
    },
    [types.GET_TEMP_PROFILE_SUCCESS]: (state, action) => {
        return state.update('tempProfile', () => Map(action.profile[0]));
    },
    [types.CREATE_ETH_ADDRESS]: (state, action) => {
        return state.updateIn(['tempProfile', 'currentStatus'],
            (cStatus) => Object.assign(cStatus, { status: 'pending' })
        );
    },
    [types.CREATE_ETH_ADDRESS_SUCCESS]: (state, action) => {
        return state.mergeDeep(fromJS({
            tempProfile: {
                address: action.data.coinbase,
                currentStatus: {
                    status: 'finished'
                }
            }
        }));
    },
    [types.CREATE_ETH_ADDRESS_ERROR]: (state, action) => {
        return state.updateIn(['tempProfile', 'currentStatus'],
            (cStatus) => Object.assign(cStatus, { status: 'failed' })
        );
    },
    [types.FUND_FROM_FAUCET]: (state, action) => {
        return state.updateIn(['tempProfile', 'currentStatus'],
            (cStatus) => Object.assign(cStatus, { status: 'pending' })
        );
    },
    [types.REQUEST_FUND_FROM_FAUCET_SUCCESS]: (state, action) => {
        return state.updateIn(['tempProfile', 'currentStatus'],
            (cStatus) => Object.assign(cStatus, { faucetRequested: true })
        );
    },
    [types.FUND_FROM_FAUCET_SUCCESS]: (state, action) => {
        return state.updateIn(['tempProfile', 'currentStatus'],
            (cStatus) => Object.assign(cStatus, { status: 'finished' })
        );
    },
    [types.FUND_FROM_FAUCET_ERROR]: (state, action) => {
        return state.updateIn(['tempProfile', 'currentStatus'],
            (cStatus) => Object.assign(cStatus, { status: 'failed' })
        );
    },
    [types.GET_PROFILE_DATA_SUCCESS]: (state, action) => {
        const profileIndex = state.get('profiles').findIndex(profile =>
            profile.get('ipfsHash') === action.profiles.ipfsHash
        );
        return state.mergeIn(['profiles', profileIndex], action.profiles);
    }
});

export default profileState;
