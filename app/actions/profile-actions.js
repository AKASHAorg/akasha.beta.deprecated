import * as types from '../constants/ProfileConstants';
import { ProfileService } from '../services';
import { SettingsActions } from '../actions';

class ProfileActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.profileService = new ProfileService;
        this.settingsActions = new SettingsActions(dispatch);
    }

    validateUsername = (username) => {

    }

    updateProfile = (profileData) => {

    }

    updatePassword = (password1, password2) => {

    }

    login = (profileData) => {
        console.log('login with profile', profileData);
    }

    getTempProfile = () =>
        this.profileService.getTempProfile().then((profile) =>
            this.dispatch({ type: types.GET_TEMP_PROFILE_SUCCESS, profile })
        ).catch(reason => this.dispatch({ type: types.GET_TEMP_PROFILE_ERROR, reason }));

    saveTempProfile = (profileData, currentStep) =>
        this.profileService.saveTempProfile(profileData, currentStep).then(() => {
            this.dispatch({
                type: types.SAVE_TEMP_PROFILE_SUCCESS,
                profileData,
                currentStep
            });
        }).catch(reason => {
            console.error(reason);
            this.dispatch({ type: types.SAVE_TEMP_PROFILE_ERROR, reason });
        });

    updateTempProfile = (profileData, currentStatus) =>
        this.profileService.updateTempProfile(profileData.get('userName'), {
            ...profileData.toJS(),
            ...currentStatus })
        .then(() =>
            this.dispatch({
                type: types.UPDATE_TEMP_PROFILE_SUCCESS,
                ...profileData.toJS(),
                ...currentStatus
            })
        ).catch(reason => {
            console.error(reason);
            this.dispatch({ type: types.UPDATE_TEMP_PROFILE_ERROR, reason });
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
            this.fundFromFaucet(newerProfile.get('address'))
        )
        .catch(reason => this.dispatch({ type: types.CREATE_ETH_ADDRESS_ERROR, error: reason }));
    }

    fundFromFaucet (profileAddress) {
        this.dispatch({ type: types.FUND_FROM_FAUCET_START });
        this.profileService.fundFromFaucet(profileAddress).then((result) => {
            this.dispatch({ type: types.FUND_FROM_FAUCET_SUCCESS, data: result });
        })
        .then(() =>
            this.dispatch((dispatch, getState) => {
                const newerProfile = getState().profileState.getIn(['tempProfile']);
                this.updateTempProfile(newerProfile, {
                    currentStatus: {
                        currentStep: 2,
                        status: 'finished',
                        message: 'fund from faucet success.'
                    }
                });
            })
        )
        .then(() => {
            console.log('Now we wait! :)');
        })
        .catch(reason => this.dispatch({ type: types.FUND_FROM_FAUCET_ERROR, error: reason }));
    }

    unlockAddress () {}

    completeProfileCreation () {}

    createProfile = () => {
        this.dispatch((dispatch, getState) => {
            const unfinishedProfiles = getState().profileState.get('tempProfile');
            if (unfinishedProfiles) {
                console.log('createProfile currentStatus', unfinishedProfiles.get('currentStatus'));
                const currentStep = unfinishedProfiles.get('currentStatus').currentStep;
                const profilePassword = unfinishedProfiles.get('password');
                const profileAddress = unfinishedProfiles.get('address');
                switch (currentStep) {
                    case 0:
                        return this.createEthAddress(profilePassword);
                    case 1:
                        return this.fundFromFaucet(profileAddress);
                    case 2:
                        return console.log('alright, keep going!');
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
                if (tempProfile.size > 0) {
                    this.createProfile();
                } else {
                    this.getProfilesList();
                }
            });
        }).catch(reason => console.error(reason, reason.stack));

    getProfilesList = () =>
        this.profileService.getProfilesList().then((profiles) =>
            this.dispatch({ type: types.GET_PROFILES_LIST_SUCCESS, profiles })
        ).catch(reason => this.dispatch({ type: types.GET_PROFILES_LIST_ERROR, reason }));

    _createProfileSuccess (profileData) {
        return { type: types.CREATE_PROFILE_SUCCESS, profileData };
    }
    _createProfileStepFailure (message) {
        return { type: types.CREATE_PROFILE_STEP_ERROR, message };
    }
}

export { ProfileActions };
