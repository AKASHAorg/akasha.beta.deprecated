import { ipcRenderer } from 'electron';
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
    /**
     * Step 1:: Create a new Ethereum address
     * Step 2:: Set address as defaultAccount
     * Step 3:: Fund the address from faucet
     * Step 4:: Unlock address
     * Step 5:: Create new AKASHA profile
     */
    checkForUnfinishedProfile () {

    }
    createEthAddress () {

    }
    fundFromFaucet () {}
    unlockAddress () {}
    completeProfileCreation () {}
    createProfile = (userData) => {
        this.settingsActions.getSettings('newProfile').then(() =>
            this.dispatch((dispatch, getState) => {
                const unfinishedProfiles = getState().settingsState.get('newProfile');
                if (unfinishedProfiles.size > 0) {
                    const nextStep = unfinishedProfiles.get('nextStep');
                    const currentStep = unfinishedProfiles.get('currentStep');
                    if (currentStep.success) {
                        return this[nextStep](unfinishedProfiles.get('payload'));
                    }
                    return dispatch(this._createProfileStepFailure(currentStep.message));
                }
            })
        ).then(() => {
            this.dispatch((dispatch, getState) => {
                console.log('resume your coding here!', 'start executing steps!');
            });
        });
        // this.profileService.createProfile(userData).then((data) => {
        //     if (!data) return console.log('no data received!');
        //     console.log('profile successfully created', data);
        //     this.dispatch(this._createProfileSuccess(data));
        // });
    }
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
