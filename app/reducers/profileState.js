import * as types from '../constants/ProfileConstants';
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

export default function profileState (state = initialState, action) {
    switch (action.type) {
        case types.LOGIN_SUCCESS:
            return state.merge({ loggedProfile: action.profileData });
        case types.GET_PROFILES_LIST_SUCCESS:
            return state.merge({ profiles: fromJS(action.profiles) });
        case types.GET_PROFILES_LIST_ERROR:
            return state.merge({ profiles: [], messages: action.message });
        case types.GET_TEMP_PROFILE_SUCCESS:
            return state.update('tempProfile', () => Map(action.profile[0]));
        case types.CREATE_ETH_ADDRESS_START:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'pending' })
            );
        case types.CREATE_ETH_ADDRESS_SUCCESS:
            return state.mergeDeep(fromJS({
                tempProfile: {
                    address: action.data.status,
                    currentStatus: {
                        status: 'finished'
                    }
                }
            }));
        case types.CREATE_ETH_ADDRESS_ERROR:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'failed' })
            );
        case types.FUND_FROM_FAUCET_START:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'pending' })
            );
        case types.REQUEST_FUND_FROM_FAUCET_SUCCESS:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { faucetRequested: true })
            );
        case types.FUND_FROM_FAUCET_SUCCESS:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'finished' })
            );
        case types.FUND_FROM_FAUCET_ERROR:
            return state.updateIn(['tempProfile', 'currentStatus'],
                (cStatus) => Object.assign(cStatus, { status: 'failed' })
            );
        case types.GET_PROFILE_DATA_SUCCESS:
            const profileIndex = state.get('profiles').findIndex(profile => {
                return profile.ipfsHash !== 'QmUgELh2SKsdsbanN1BW7cct9XFoovzAj6uosnH8HnTWpn';
            });
            return state.mergeIn(['profiles', profileIndex], action.profile);
        default:
            return state;
    }
}
