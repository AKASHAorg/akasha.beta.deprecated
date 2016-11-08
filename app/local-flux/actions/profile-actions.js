import { AppActions, TransactionActions } from 'local-flux';
import { ProfileService, AuthService, RegistryService } from '../services';
import { profileActionCreators } from './action-creators';
import imageCreator from '../../utils/imageUtils';

let profileActions = null;

class ProfileActions {
    constructor (dispatch) {
        if (!profileActions) {
            profileActions = this;
        }
        this.appActions = new AppActions(dispatch);
        this.transactionActions = new TransactionActions(dispatch);
        this.profileService = new ProfileService();
        this.authService = new AuthService();
        this.registryService = new RegistryService();
        this.dispatch = dispatch;
        return profileActions;
    }

    login = ({ account, password, rememberTime }) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            if (!flags.get('loginRequested')) {
                password = new TextEncoder('utf-8').encode(password);
                dispatch(profileActionCreators.login({
                    loginRequested: true
                }));
                this.authService.login({
                    account,
                    password,
                    rememberTime,
                    onSuccess: (data) => {
                        this.dispatch(profileActionCreators.loginSuccess(data, {
                            loginRequested: false
                        }));
                        this.getCurrentProfile();
                    },
                    onError: error => this.dispatch(profileActionCreators.loginError(error, {
                        loginRequested: false
                    }))
                });
            }
        });
    };

    logout = (profileKey, flush) => {
        this.authService.logout({
            options: {
                profileKey,
                flush
            },
            onSuccess: data => this.dispatch(profileActionCreators.logoutSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.logoutError(error))
        });
    };

    getLoggedProfile = () => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            if (!flags.get('fetchingLoggedProfile')) {
                dispatch(profileActionCreators.getLoggedProfile({
                    fetchingLoggedProfile: true
                }));
                this.authService.getLoggedProfile({
                    onSuccess: (data) => {
                        dispatch(profileActionCreators.getLoggedProfileSuccess(data, {
                            fetchingLoggedProfile: false
                        }));
                        this.getCurrentProfile();
                    },
                    onError: error => dispatch(profileActionCreators.getLoggedProfileError(error, {
                        fetchingLoggedProfile: false
                    }))
                });
            }
        });
    };

    getLocalProfiles = () => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            if (!flags.get('fetchingLocalProfiles') && !flags.get('localProfilesFetched')) {
                dispatch(profileActionCreators.getLocalProfiles({
                    fetchingLocalProfiles: true
                }));
                this.authService.getLocalIdentities({
                    onSuccess: (data) => {
                        this.dispatch(profileActionCreators.getLocalProfilesSuccess(data, {
                            fetchingLocalProfiles: false,
                            localProfilesFetched: true
                        }));
                    },
                    onError: err => this.dispatch(profileActionCreators.getLocalProfilesError(err, {
                        fetchingLocalProfiles: false,
                        localProfilesFetched: false
                    }))
                });
            }
        });
    };

    getCurrentProfile = () => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            if (!flags.get('fetchingCurrentProfile') && !flags.get('currentProfileFetched')) {
                dispatch(profileActionCreators.getCurrentProfile({
                    fetchingCurrentProfile: true
                }));
                this.registryService.getCurrentProfile({
                    onSuccess: data =>
                        dispatch(profileActionCreators.getCurrentProfileSuccess(data, {
                            fetchingCurrentProfile: false,
                            currentProfileFetched: true
                        })),
                    onError: err => dispatch(profileActionCreators.getCurrentProfileError(err, {
                        fetchingCurrentProfile: false
                    }))
                });
            }
        });
    };

    clearLocalProfiles = () =>
        this.dispatch(profileActionCreators.clearLocalProfilesSuccess());
    /**
     * profiles = [{key: string, profile: string}]
     */
    getProfileData = (profiles, full = false) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            if (!flags.get('fetchingProfileData')) {
                dispatch(profileActionCreators.getProfileData({
                    fetchingProfileData: true
                }));
                profiles.forEach((profileObject) => {
                    this.profileService.getProfileData({
                        options: {
                            profile: profileObject.profile,
                            full
                        },
                        onSuccess: (data) => {
                            if (data.avatar) {
                                data.avatar = imageCreator(data.avatar, data.baseUrl);
                            }
                            dispatch(profileActionCreators.getProfileDataSuccess(data, {
                                fetchingProfileData: false
                            }));
                        },
                        onError: (err) => {
                            dispatch(profileActionCreators.getProfileDataError(err, {
                                fetchingProfileData: false
                            }));
                        }
                    });
                });
            }
        });
    };

    updateProfileData = (updatedProfile, loggedProfile, gas) => {
        const isLoggedIn = Date.parse(loggedProfile.get('expiration')) > Date.now();
        const {
            firstName,
            lastName,
            avatar,
            about,
            links,
            backgroundImage
        } = updatedProfile;
        const ipfs = {
            firstName,
            lastName,
            about,
            avatar
        };

        if (links) {
            ipfs.links = links;
        }

        if (backgroundImage) {
            ipfs.backgroundImage = backgroundImage.length ? backgroundImage[0] : backgroundImage;
        }
        if (isLoggedIn) {
            this.updateProfile();
            this.dispatch(() => {
                this.profileService.updateProfileData({
                    token: loggedProfile.get('token'),
                    ipfs,
                    gas,
                    onSuccess: (data) => {
                        this.transactionActions.listenForMinedTx();
                        this.transactionActions.addToQueue([{
                            tx: data.tx,
                            type: 'updateProfile'
                        }]);
                        this.showNotification('updatingProfile');
                    },
                    onError: (error) => {
                        this.updateProfileDataError(error);
                    }
                });
            });
        } else if (!isLoggedIn) {
            this.appActions.showAuthDialog();
        }
    };

    updateProfile = () =>
        this.dispatch(profileActionCreators.updateProfileData());

    updateProfileDataSuccess = () =>
        this.dispatch(profileActionCreators.updateProfileDataSuccess());

    updateProfileDataError = error =>
        this.dispatch(profileActionCreators.updateProfileDataError(error));

    getProfileBalance = (profileKey, unit) =>
        this.profileService.getProfileBalance({
            options: {
                profile: profileKey,
                unit
            },
            onSuccess: data => this.dispatch(profileActionCreators.getProfileBalanceSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.getProfileBalanceError(error))
        });

    clearLoggedProfile = () => {
        this.authService.deleteLoggedProfile({
            onSuccess: () => this.dispatch(profileActionCreators.deleteLoggedProfileSuccess()),
            onError: error => this.dispatch(profileActionCreators.deleteLoggedProfileError(error))
        });
    };

    clearErrors = () => {
        this.dispatch(profileActionCreators.clearErrors());
    };
    resetFlags = () => {
        this.dispatch(profileActionCreators.resetFlags());
    }
    // this method is only called to check if there is a logged profile
    // it does not dispatch anything and is useless as an action
    //
    checkLoggedProfile = (cb) => {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            if (loggedProfile.get('account')) {
                return cb(null, true);
            }
            return this.authService.getLoggedProfile({
                onSuccess: (data) => {
                    if (data && data.account !== '') {
                        return cb(null, true);
                    }
                    return cb(null, false);
                },
                onError: err => cb(err, false)
            });
        });
    }

    showNotification = notification =>
        this.dispatch(profileActionCreators.showNotification(notification));

    hideNotification = notification =>
        this.dispatch(profileActionCreators.hideNotification(notification));

    getFollowersCount = (profileAddress) => {
        this.dispatch(profileActionCreators.getFollowersCount());
        this.profileService.getFollowersCount({
            profileAddress,
            onError: error =>
                this.dispatch(profileActionCreators.getFollowersCountError(error)),
            onSuccess: data =>
                this.dispatch(
                    profileActionCreators.getFollowersCountSuccess(profileAddress, data.count)
                )
        });
    }

    getFollowingCount = (profileAddress) => {
        this.dispatch(profileActionCreators.getFollowingCount());
        this.profileService.getFollowingCount({
            profileAddress,
            onError: error =>
                this.dispatch(profileActionCreators.getFollowingCountError(error)),
            onSuccess: data =>
                this.dispatch(
                    profileActionCreators.getFollowingCountSuccess(profileAddress, data.count)
                )
        });
    }

    followProfile = (loggedProfile, profileAddress, gas) => {
        const isLoggedIn = Date.parse(loggedProfile.get('expiration')) > Date.now();
        if (isLoggedIn) {
            const flagOn = { profileAddress, value: true };
            this.dispatch(profileActionCreators.followProfile({ followPending: flagOn }));
            this.dispatch((dispatch) => {
                this.profileService.follow({
                    token: loggedProfile.get('token'),
                    profileAddress,
                    gas,
                    onSuccess: (data) => {
                        this.transactionActions.listenForMinedTx();
                        this.transactionActions.addToQueue([{
                            tx: data.tx,
                            type: 'followProfile',
                            profileAddress
                        }]);
                        this.showNotification('following');
                    },
                    onError: (error) => {
                        const flagOff = { profileAddress, value: false };
                        dispatch(profileActionCreators.followProfileError(error, flagOff));
                    }
                });
            });
        } else if (!isLoggedIn) {
            this.appActions.showAuthDialog();
        }
    }

    followProfileSuccess = profileAddress =>
        this.dispatch(profileActionCreators.followProfileSuccess({
            followPending: { profileAddress, value: false }
        }));
}
export { ProfileActions };
