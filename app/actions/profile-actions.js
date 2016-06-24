import * as types from '../constants/ProfileConstants';
import { ProfileService } from '../services';
import { SettingsActions } from '../actions';
import {hashHistory} from 'react-router';
import debug from 'debug';
const dbg = debug('App:ProfileActions:');

class ProfileActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.profileService = new ProfileService;
        this.settingsActions = new SettingsActions(dispatch);
    }

    validateUsername = (username) => {

    }

    login = (profileData) => {
        console.log('login with profile', profileData);
    }

    getTempProfile = () =>
        this.profileService.getTempProfile().then((profile) => {
            dbg('getTempProfile', profile);
            return this.dispatch({ type: types.GET_TEMP_PROFILE_SUCCESS, profile });
        })
        .catch(reason => this.dispatch({ type: types.GET_TEMP_PROFILE_ERROR, reason }));

    saveTempProfile = (profileData, currentStatus) =>
        this.profileService.saveTempProfile(profileData, currentStatus).then(() => {
            dbg('saveTempProfile', { profileData, currentStatus });
            this.dispatch({
                type: types.SAVE_TEMP_PROFILE_SUCCESS,
                profileData,
                currentStatus
            });
        }).catch(reason => {
            console.error(reason);
            this.dispatch({ type: types.SAVE_TEMP_PROFILE_ERROR, reason });
        });

    updateTempProfile = (profileData, currentStatus) =>
        this.profileService.updateTempProfile(profileData.get('userName'), {
            ...profileData.toJS(),
            ...currentStatus })
        .then(() => {
            dbg('updateTempProfile', { ...profileData.toJS(), ...currentStatus });
            return this.dispatch({
                type: types.UPDATE_TEMP_PROFILE_SUCCESS,
                ...profileData.toJS(),
                ...currentStatus
            });
        })
        .catch(reason => {
            console.error(reason);
            this.dispatch({ type: types.UPDATE_TEMP_PROFILE_ERROR, reason });
        });

    clearTempProfile = () =>
        this.profileService.clearTempProfile().then(() => {
            dbg('clearTempProfile');
            this.dispatch({ type: types.CLEAR_TEMP_PROFILE_SUCCESS });
        }).catch(reason => {
            console.error(reason);
            this.dispatch({ type: types.CLEAR_TEMP_PROFILE_ERROR, reason });
        });
    /**
     * Step 1:: Create a new Ethereum address
     * Step 2:: Set address as defaultAccount
     * Step 3:: Fund the address from faucet
     * Step 4:: Unlock address
     * Step 5:: Create new AKASHA profile
     */

    createEthAddress (profilePassword) {
        this.dispatch({ type: types.CREATE_ETH_ADDRESS_START });
        this.profileService.createEthAddress(profilePassword).then((result) => {
            dbg('createEthAddress', result);
            this.dispatch({ type: types.CREATE_ETH_ADDRESS_SUCCESS, data: result });
        })
        .then(() =>
            this.dispatch((dispatch, getState) => {
                const newerProfile = getState().profileState.getIn(['tempProfile']);
                this.updateTempProfile(newerProfile, {
                    currentStatus: {
                        currentStep: 1,
                        status: 'finished',
                        message: 'eth address created'
                    }
                });
                return newerProfile;
            })
        )
        .then((newerProfile) =>
            this.requestFundFromFaucet(newerProfile.get('address'))
        )
        .catch(reason => this.dispatch({ type: types.CREATE_ETH_ADDRESS_ERROR, error: reason }));
    }
    requestFundFromFaucet (profileAddress) {
        this.dispatch({ type: types.FUND_FROM_FAUCET_START });
        this.profileService.requestFundFromFaucet(profileAddress).then((result) => {
            dbg('requestFundFromFaucet_success', result);
            return this.dispatch({ type: types.REQUEST_FUND_FROM_FAUCET_SUCCESS, data: result });
        })
        .then(() => {
            this.dispatch((dispatch, getState) => {
                const newerProfile = getState().profileState.getIn(['tempProfile']);
                this.updateTempProfile(newerProfile, {
                    currentStatus: {
                        currentStep: 2,
                        status: 'finished',
                        message: 'fund from faucet request success.'
                    }
                });
            });
        })
        .then(() => {
            this.fundFromFaucet();
        });
    }
    fundFromFaucet () {
        dbg('funding from faucet');
        this.profileService.fundFromFaucet().then((result) => {
            dbg('fundFromFaucet', result);
            return this.dispatch({ type: types.FUND_FROM_FAUCET_SUCCESS, data: result });
        })
        .then(() =>
            this.dispatch((dispatch, getState) => {
                const newerProfile = getState().profileState.getIn(['tempProfile']);
                this.updateTempProfile(newerProfile, {
                    currentStatus: {
                        currentStep: 3,
                        status: 'finished',
                        message: 'fund from faucet success.'
                    }
                });
                return newerProfile;
            })
        )
        .then((profileData) => {
            this.completeProfileCreation(profileData);
        })
        .catch(reason => this.dispatch({ type: types.FUND_FROM_FAUCET_ERROR, error: reason }));
    }

    completeProfileCreation (profileData) {
        this.profileService.completeProfileCreation(profileData).then(result => {
            dbg('completeProfileCreation', result);
            this.dispatch({ type: types.COMPLETE_PROFILE_CREATION_SUCCESS, data: result });
            return result;
        })
        .then((result) => {
            if (result.success) {
                return this.clearTempProfile();
            }
            return console.error(result);
        });
    }

    createProfile = () => {
        this.dispatch((dispatch, getState) => {
            const unfinishedProfiles = getState().profileState.get('tempProfile');
            dbg('createProfile', unfinishedProfiles);
            if (unfinishedProfiles) {
                const currentStep = unfinishedProfiles.get('currentStatus').currentStep;
                const profilePassword = unfinishedProfiles.get('password');
                const profileAddress = unfinishedProfiles.get('address');
                dbg('resuming step', currentStep);
                switch (currentStep) {
                    case 0:
                        return this.createEthAddress(profilePassword);
                    case 1:
                        return this.requestFundFromFaucet(profileAddress);
                    case 2:
                        return this.fundFromFaucet();
                    case 3:
                        return this.completeProfileCreation(unfinishedProfiles);
                    default:
                        break;
                }
            } else {
                // no new profile.
                this.getProfilesList();
            }
        });
    }
    checkTempProfile = () =>
        this.getTempProfile().then(() => {
            this.dispatch((dispatch, getState) => {
                const tempProfile = getState().profileState.get('tempProfile');
                dbg('checkTempProfile', tempProfile);
                if (tempProfile.size > 0) {
                    hashHistory.push('new-profile-status');
                }
                return this.getProfilesList();
            });
        }).catch(reason => console.error(reason, reason.stack));

    getProfilesList = () =>
        this.profileService.getProfilesList().then((profiles) => {
            dbg('getProfilesList', profiles);
            return this.dispatch({ type: types.GET_PROFILES_LIST_SUCCESS, profiles });
        }).catch(reason => this.dispatch({ type: types.GET_PROFILES_LIST_ERROR, reason }));

    _createProfileStepFailure (message) {
        return { type: types.CREATE_PROFILE_STEP_ERROR, message };
    }
}

export { ProfileActions };
