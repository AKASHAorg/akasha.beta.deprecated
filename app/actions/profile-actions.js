import { ProfileService } from '../services';
import { SettingsActions } from '../actions';
import { profileActionCreators } from './action-creators';
import { hashHistory } from 'react-router';
import { ipcRenderer } from 'electron';
import debug from 'debug';
const dbg = debug('App:ProfileActions:');
let profileActions = null;

class ProfileActions {
    constructor (dispatch) {
        if (!profileActions) {
            profileActions = this;
        }
        this.dispatch = dispatch;
        this.profileService = new ProfileService;
        this.settingsActions = new SettingsActions(dispatch);
        return profileActions;
    }

    login = (profileData) =>
        this.profileService.login(profileData).then(result => {
            if (!result) {
                const error = new Error('Main process doomed');
                return this.dispatch(profileActionCreators.loginError(error));
            }
            if (!result.success) {
                const error = new Error(result.status.message, 'login action');
                return this.dispatch(profileActionCreators.loginError(error));
            }
            return this.dispatch(profileActionCreators.loginSuccess(result));
        })
        .then(() => {
            this.dispatch((dispatch, getState) => {
                const loggedProfile = getState().profileState.get('loggedProfile');
                if (loggedProfile.size > 0) {
                    this.profileService.saveLoggedProfile(loggedProfile.toJS()).then(() => {
                        hashHistory.push(`/${loggedProfile.get('userName')}`);
                    });
                }
            });
        })
        .catch(reason => profileActionCreators.loginError(reason));

    logout = (account) => {
        this.profileService.logout(account).then(result => {
            this.dispatch(profileActionCreators.logoutSuccess(result));
        })
        .then(() => {
            this.profileService.removeLoggedProfile().then(() => {
                hashHistory.push('authenticate');
            });
        }).catch(reason => profileActionCreators.logoutError(reason));
    }

    checkLoggedProfile = (options = {}) =>
        this.profileService.getLoggedProfile().then(loggedProfile => {
            const profile = loggedProfile[0];
            if (profile) {
                this.dispatch(profileActionCreators.loginSuccess(profile));
                if (!options.noRedirect) {
                    return hashHistory.push(`/${profile.username}`);
                }
            }
            return null;
        });
    /**
     * Retrieve all temporary profiles
     */
    getTempProfile = () =>
        this.profileService.getTempProfile().then((profile) => {
            dbg('getTempProfile', profile);
            return this.dispatch(profileActionCreators.getTempProfileSuccess(profile));
        })
        .catch(reason => this.dispatch(profileActionCreators.getTempProfileError(reason)));

    createTempProfile = (profileData, currentStatus) =>
        this.profileService.createTempProfile(profileData, currentStatus).then(() => {
            dbg('createTempProfile', { profileData, currentStatus });
            this.dispatch(
                profileActionCreators.createTempProfileSuccess(profileData, currentStatus)
            );
        }).catch(reason =>
            this.dispatch(profileActionCreators.createTempProfileError(reason))
        );

    updateTempProfile = (profileData, currentStatus) =>
        this.profileService.updateTempProfile(profileData.get('userName'), {
            ...profileData.toJS(),
            ...currentStatus })
        .then(() => {
            dbg('updateTempProfile', { ...profileData.toJS(), ...currentStatus });
            return this.dispatch(
                profileActionCreators.updateTempProfileSuccess(
                    ...profileData.toJS(),
                    ...currentStatus
                )
            );
        })
        .catch(reason =>
            this.dispatch(profileActionCreators.updateTempProfileError(reason))
        );

    deleteTempProfile = () =>
        this.profileService.deleteTempProfile().then(() => {
            dbg('deleteTempProfile');
            this.dispatch(profileActionCreators.deleteTempProfileSuccess());
        }).catch(reason =>
            this.dispatch(profileActionCreators.deleteTempProfileError(reason))
        );

    /**
     * Step0: Creates a new eth address and updates the status of the profile creation process
     * @param: {string} profilePassword
     */
    createEthAddress (profilePassword) {
        this.dispatch(profileActionCreators.createEthAddress());
        this.profileService.createEthAddress(profilePassword).then(result => {
            dbg('createEthAddress', result);
            if (!result.success) {
                dbg(result.status.message);
                this.dispatch(profileActionCreators.createEthAddressError(result.status.message));
            }
            this.dispatch(profileActionCreators.createEthAddressSuccess(result.data));
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
        .catch(reason => this.dispatch(profileActionCreators.createEthAddressError(reason)));
    }
    /**
     * Step1: Send request to faucet and store the status of this step in indexedDB
     * @param {string} profileAddress
     */
    requestFundFromFaucet (profileAddress) {
        this.dispatch(profileActionCreators.requestFund());
        this.profileService.requestFundFromFaucet(profileAddress).then(result => {
            dbg('requestFundFromFaucet_success', result);
            if (!result.success) {
                dbg('ERROR: ', result.status.message);
                this.dispatch(profileActionCreators.requestFundError(result.status.error));
            }
            return this.dispatch(profileActionCreators.requestFundSuccess(result.data));
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
        this.profileService.fundFromFaucet().then(result => {
            dbg('fundFromFaucet', result);
            return this.dispatch(profileActionCreators.fundSuccess(result.data));
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
                }).then(() =>
                    this.completeProfileCreation(newerProfile)
                );
            })
        )
        .catch(reason => this.dispatch(profileActionCreators.fundError(reason)));
    }
    /**
     * Step4 (last step) acctually create the profile using data received from the user
     * @param {object} profileData
     */
    completeProfileCreation (profileData) {
        this.profileService.completeProfileCreation(profileData).then(result => {
            dbg('completeProfileCreation', result);
            if (!result.success) {
                this.dispatch(
                    profileActionCreators.completeProfileCreationError(result.status.error)
                );
            }
            this.dispatch(profileActionCreators.completeProfileCreationSuccess(result.data));
            return result;
        })
        .then((result) => {
            if (result.success) {
                return this.deleteTempProfile();
            }
            dbg('completeProfileCreation_ERROR', result);
            return result;
        })
        .then((result) => {
            if (result.success) {
                hashHistory.push('authenticate');
            }
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
            }
            // no new profile.
            return this.getLocalProfiles();
        });
    }

    /**
     * Check if temp profile exists. If true then navigate to profile status page.
     * Else populate profile lists
     */
    checkTempProfile = () =>
        this.getTempProfile().then(() =>
            this.dispatch((dispatch, getState) => {
                const tempProfile = getState().profileState.get('tempProfile');
                dbg('checkTempProfile', tempProfile);
                if (tempProfile && tempProfile.size > 0) {
                    return hashHistory.push('new-profile-status');
                }
                return this.getLocalProfiles();
            })
        ).catch(reason =>
            this.dispatch(profileActionCreators.checkTempProfileError(reason))
        )

    getLocalProfiles = () =>
        this.getProfilesList().then(() =>
            this.dispatch((dispatch, getState) => {
                // EVENTS.client.user.getProfileData

                const profilesHash = getState().profileState.get('profiles');
                const hashes = profilesHash.toJS().map(el => el.ipfsHash);
                this.getProfileData(hashes);
            })
        )
        .catch(reason => console.error(reason));
    /**
     * get all local profiles available
     * returns only the address and userName
     */
    getProfilesList = () =>
        this.profileService.getProfilesList().then(profiles => {
            dbg('getProfilesList', profiles);
            return this.dispatch(profileActionCreators.getProfilesListSuccess(profiles.data));
        }).catch(reason => this.dispatch(profileActionCreators.getProfilesListError(reason)));

    getProfileData = (ipfsHashes) => {
        this.profileService.getProfileData(ipfsHashes, (err, profile) => {
            if (err) {
                dbg('ERROR', err);
                this.dispatch(profileActionCreators.getProfileDataError(err));
            }
            return this.dispatch(profileActionCreators.getProfileDataSuccess(profile));
        });
    }
}
export { ProfileActions };
