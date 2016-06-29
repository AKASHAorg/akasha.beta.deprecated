import * as types from '../constants/ProfileConstants';
import { ProfileService } from '../services';
import { SettingsActions } from '../actions';
import { hashHistory } from 'react-router';
import debug from 'debug';
const dbg = debug('App:ProfileActions:');

class ProfileActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.profileService = new ProfileService;
        this.settingsActions = new SettingsActions(dispatch);
    }
    /**
     * Validates userName at the blockchain level
     */
    validateUsername = (username) => {
        this.profileService.validateUsername(username).then(result => {
            this.dispatch({ type: types.VALIDATE_USERNAME_SUCCESS, result });
        }).catch(reason => console.error(reason));
    }

    login = (profileData) =>
        this.profileService.login(profileData).then(result => {
            if (!result) {
                const error = new Error('Main process doomed');
                return this.dispatch({ type: types.LOGIN_ERROR, error });
            }
            if (!result.success) {
                const error = new Error(result.status.message, 'login action');
                return this.dispatch({ type: types.LOGIN_ERROR, error });
            }
            return this.dispatch({ type: types.LOGIN_SUCCESS, profileData });
        }).then(() => {
            this.dispatch((dispatch, getState) => {
                const loggedProfile = getState().profileState.get('loggedProfile');
                if (loggedProfile.size > 0) {
                    hashHistory.push(`/${loggedProfile.get('username')}`);
                }
            });
        }).catch(reason => console.error(reason));
    /**
     * Retrieve all temporary profiles
     */
    getTempProfile = () =>
        this.profileService.getTempProfile().then((profile) => {
            dbg('getTempProfile', profile);
            return this.dispatch({ type: types.GET_TEMP_PROFILE_SUCCESS, profile });
        })
        .catch(reason => this.dispatch({ type: types.GET_TEMP_PROFILE_ERROR, reason }));

    createTempProfile = (profileData, currentStatus) =>
        this.profileService.createTempProfile(profileData, currentStatus).then(() => {
            dbg('createTempProfile', { profileData, currentStatus });
            this.dispatch({
                type: types.CREATE_TEMP_PROFILE_SUCCESS,
                profileData,
                currentStatus
            });
        }).catch(reason => {
            console.error(reason);
            this.dispatch({ type: types.CREATE_TEMP_PROFILE_ERROR, reason });
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

    deleteTempProfile = () =>
        this.profileService.deleteTempProfile().then(() => {
            dbg('deleteTempProfile');
            this.dispatch({ type: types.DELETE_TEMP_PROFILE_SUCCESS });
        }).catch(reason => {
            console.error(reason);
            this.dispatch({ type: types.DELETE_TEMP_PROFILE_ERROR, reason });
        });
    /**
     * Step0: Creates a new eth address and updates the status of the profile creation process
     * @param: {string} profilePassword
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
    /**
     * Step1: Send request to faucet and store the status of this step in indexedDB
     * @param {string} profileAddress
     */
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
    /**
     * Step2: Verify if balance > 0 or faucet transaction was mined
     * and proceed to the next step
     */
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
    /**
     * Step4 (last step) acctually create the profile using data received from the user
     * @param {object} profileData
     */
    completeProfileCreation (profileData) {
        this.profileService.completeProfileCreation(profileData).then(result => {
            dbg('completeProfileCreation', result);
            this.dispatch({ type: types.COMPLETE_PROFILE_CREATION_SUCCESS, data: result });
            return result;
        })
        .then((result) => {
            if (result.success) {
                return this.deleteTempProfile();
            }
            return console.error(result);
        }).then(() => {
            hashHistory.push('')
        });
    }
     /**
     * Resumes the process of profile creation
     * Step 0:: Create a new Ethereum address
     * Step 1:: Request funds from faucet
     * Step 2:: Receive funds from faucet
     * Step 3:: Create new profile
     */
    createProfile = () => {
        this.dispatch((dispatch, getState) => {
            const unfinishedProfiles = getState().profileState.get('tempProfile');
            dbg('createProfile', unfinishedProfiles.toJS());
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
    /**
     * Check if temp profile exists. If true then navigate to profile status page.
     * Else populate profile lists
     */
    checkTempProfile = () =>
        this.getTempProfile().then(() => {
            this.dispatch((dispatch, getState) => {
                const tempProfile = getState().profileState.get('tempProfile');
                dbg('checkTempProfile', tempProfile);
                if (tempProfile.size > 0) {
                    return hashHistory.push('new-profile-status');
                }
                return this.getProfilesList();
            });
        }).catch(reason => console.error(reason, reason.stack));
    /**
     * get all local profiles available
     * returns only the address and userName
     */
    getProfilesList = () =>
        this.profileService.getProfilesList().then((result) => {
            dbg('getProfilesList', result.status);
            return this.dispatch({ type: types.GET_PROFILES_LIST_SUCCESS, profiles: result.status });
        }).catch(reason => this.dispatch({ type: types.GET_PROFILES_LIST_ERROR, reason }));
    /**
     *
     */
    _createProfileStepFailure (message) {
        return { type: types.CREATE_PROFILE_STEP_ERROR, message };
    }
}

export { ProfileActions };
