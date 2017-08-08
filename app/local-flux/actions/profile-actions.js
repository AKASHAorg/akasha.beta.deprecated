import { AppActions, TransactionActions } from './';
import { ProfileService, AuthService, RegistryService } from '../services';
import { profileActionCreators } from './action-creators';
import imageCreator from '../../utils/imageUtils';
import { action } from './helpers';
import * as types from '../constants';

let profileActions = null;

class ProfileActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (profileActions) {
            return profileActions;
        }
        this.appActions = new AppActions(dispatch);
        this.transactionActions = new TransactionActions(dispatch);
        // this.profileService = new ProfileService();
        this.authService = new AuthService();
        // this.registryService = new RegistryService();
        this.dispatch = dispatch;
        profileActions = this;
    }

    login = ({ account, password, rememberTime, akashaId }) => {
        this.dispatch((dispatch, getState) => {
            const flags = getState().profileState.get('flags');
            password = new TextEncoder('utf-8').encode(password);
            dispatch(profileActionCreators.login({
                loginRequested: true
            }));
            this.authService.login({
                account,
                password,
                rememberTime,
                akashaId,
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
            if (!flags.get('fetchingLocalProfiles')) {
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

    clearOtherProfiles = () =>
        this.dispatch(profileActionCreators.clearOtherProfiles());

    /**
     * profiles = [{key: string, profile: string}]
     */
    getProfileData = (profiles, full = false) => {
        this.dispatch(profileActionCreators.getProfileData({
            fetchingProfileData: true
        }));
        profiles.forEach((profileObject) => {
            // this.profileService.getProfileData({
            //     options: {
            //         profile: profileObject.profile,
            //         full
            //     },
            //     onSuccess: (data) => {
            //         if (data.avatar) {
            //             data.avatar = imageCreator(data.avatar, data.baseUrl);
            //         }
            //         this.dispatch(profileActionCreators.getProfileDataSuccess(data, {
            //             fetchingProfileData: false
            //         }));
            //     },
            //     onError: (err) => {
            //         this.dispatch(profileActionCreators.getProfileDataError(err, {
            //             fetchingProfileData: false
            //         }));
            //     }
            // });
        });
    };

    updateProfileData = (updatedProfile, gas) => {
        const { firstName, lastName, avatar, about, links,
            backgroundImage } = updatedProfile.toJS();
        const ipfs = { firstName, lastName, about, avatar };

        if (links) {
            ipfs.links = links;
        }

        if (backgroundImage) {
            ipfs.backgroundImage = backgroundImage.length ? backgroundImage[0] : backgroundImage;
        }
        this.dispatch(profileActionCreators.updateProfileData({
            updatingProfile: true
        }));
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            // this.profileService.updateProfileData({
            //     token: loggedProfile.get('token'),
            //     ipfs,
            //     gas,
            //     onSuccess: (data) => {
            //         this.transactionActions.listenForMinedTx();
            //         this.transactionActions.addToQueue([{
            //             tx: data.tx,
            //             type: 'updateProfile'
            //         }]);
            //         this.appActions.showNotification({
            //             id: 'updatingProfile',
            //             values: {},
            //             duration: 3000
            //         });
            //     },
            //     onError: error =>
            //         dispatch(profileActionCreators.updateProfileDataError(error, {
            //             updatingProfile: false
            //         }))
            // });
        });
    };

    getProfileList = (profiles) => {
        this.dispatch(profileActionCreators.getProfileList({
            fetchingProfileList: true
        }));
        // this.profileService.getProfileList({
        //     profiles,
        //     onSuccess: (data) => {
        //         data.collection.forEach((item) => {
        //             if (item.avatar) {
        //                 item.avatar = imageCreator(item.avatar, item.baseUrl);
        //             }
        //         });
        //         this.dispatch(profileActionCreators.getProfileListSuccess(data, {
        //             fetchingProfileList: false
        //         }));
        //     },
        //     onError: error =>
        //         this.dispatch(profileActionCreators.getProfileListError(error, {
        //             fetchingProfileList: false
        //         }))
        // });
    }

    updateProfileDataSuccess = () => {
        this.dispatch(profileActionCreators.updateProfileDataSuccess({
            updatingProfile: false
        }));
        this.appActions.showNotification({
            id: 'profileUpdateSuccess',
            values: { }
        });
    };

    getProfileBalance = unit =>
        this.dispatch((dispatch, getState) => {
            const profileKey = getState().profileState.getIn(['loggedProfile', 'account']);
            // this.profileService.getProfileBalance({
            //     options: {
            //         etherBase: profileKey,
            //         unit
            //     },
            //     onSuccess: data =>
            //         this.dispatch(profileActionCreators.getProfileBalanceSuccess(data)),
            //     onError: error =>
            //         this.dispatch(profileActionCreators.getProfileBalanceError(error))
            // });
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
    clearLoginErrors = () => {
        this.dispatch(profileActionCreators.clearLoginErrors());
    };
    resetFlags = () => {
        this.dispatch(profileActionCreators.resetFlags());
    };
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
    };

    hideNotification = notification =>
        this.dispatch(profileActionCreators.hideNotification(notification));

    getFollowersCount = (akashaId) => {
        this.dispatch(profileActionCreators.getFollowersCount());
        // this.profileService.getFollowersCount({
        //     akashaId,
        //     onError: error =>
        //         this.dispatch(profileActionCreators.getFollowersCountError(error)),
        //     onSuccess: data =>
        //         this.dispatch(
        //             profileActionCreators.getFollowersCountSuccess(data.akashaId, data.count)
        //         )
        // });
    };

    getFollowingCount = (akashaId) => {
        this.dispatch(profileActionCreators.getFollowingCount());
        // this.profileService.getFollowingCount({
        //     akashaId,
        //     onError: error =>
        //         this.dispatch(profileActionCreators.getFollowingCountError(error)),
        //     onSuccess: data =>
        //         this.dispatch(
        //             profileActionCreators.getFollowingCountSuccess(data.akashaId, data.count)
        //         )
        // });
    };

    followersIterator = (akashaId, start, limit) => {
        this.dispatch(profileActionCreators.followersIterator({
            fetchingFollowers: true
        }));
        // this.profileService.followersIterator({
        //     akashaId,
        //     start,
        //     limit,
        //     onError: error =>
        //         this.dispatch(profileActionCreators.followersIteratorError(error, {
        //             fetchingFollowers: false
        //         })),
        //     onSuccess: (data) => {
        //         const akashaIds = [];
        //         data.collection.forEach((item) => {
        //             if (item.profile) {
        //                 akashaIds.push({ akashaId: item.profile.akashaId });
        //                 if (item.profile.avatar) {
        //                     item.profile.avatar =
        //                         imageCreator(item.profile.avatar, item.profile.baseUrl);
        //                 }
        //             }
        //         });
        //         this.profileService.saveAkashaIds(akashaIds);
        //         this.dispatch(profileActionCreators.followersIteratorSuccess(data, {
        //             fetchingFollowers: false
        //         }));
        //     }
        // });
    };

    moreFollowersIterator = (akashaId, start, limit) => {
        this.dispatch(profileActionCreators.moreFollowersIterator({
            fetchingMoreFollowers: true
        }));
        // this.profileService.moreFollowersIterator({
        //     akashaId,
        //     start,
        //     limit,
        //     onError: error =>
        //         this.dispatch(profileActionCreators.moreFollowersIteratorError(error, {
        //             fetchingMoreFollowers: false
        //         })),
        //     onSuccess: (data) => {
        //         const akashaIds = [];
        //         data.collection.forEach((item) => {
        //             if (item.profile) {
        //                 akashaIds.push({ akashaId: item.profile.akashaId });
        //                 if (item.profile.avatar) {
        //                     item.profile.avatar =
        //                         imageCreator(item.profile.avatar, item.profile.baseUrl);
        //                 }
        //             }
        //         });
        //         this.profileService.saveAkashaIds(akashaIds);
        //         this.dispatch(profileActionCreators.moreFollowersIteratorSuccess(data, {
        //             fetchingMoreFollowers: false
        //         }));
        //     }
        // });
    };

    followingIterator = (akashaId, start, limit) => {
        this.dispatch(profileActionCreators.followingIterator({
            fetchingFollowing: true
        }));
        // this.profileService.followingIterator({
        //     akashaId,
        //     start,
        //     limit,
        //     onError: error =>
        //         this.dispatch(profileActionCreators.followingIteratorError(error, {
        //             fetchingFollowing: false
        //         })),
        //     onSuccess: (data) => {
        //         const akashaIds = [];
        //         data.collection.forEach((item) => {
        //             if (item.profile) {
        //                 akashaIds.push({ akashaId: item.profile.akashaId });
        //                 if (item.profile.avatar) {
        //                     item.profile.avatar =
        //                         imageCreator(item.profile.avatar, item.profile.baseUrl);
        //                 }
        //             }
        //         });
        //         this.profileService.saveAkashaIds(akashaIds);
        //         this.dispatch(profileActionCreators.followingIteratorSuccess(data, {
        //             fetchingFollowing: false
        //         }));
        //     }
        // });
    };

    moreFollowingIterator = (akashaId, start, limit) => {
        this.dispatch(profileActionCreators.moreFollowingIterator({
            fetchingMoreFollowing: true
        }));
        // this.profileService.moreFollowingIterator({
        //     akashaId,
        //     start,
        //     limit,
        //     onError: error =>
        //         this.dispatch(profileActionCreators.moreFollowingIteratorError(error, {
        //             fetchingMoreFollowing: false
        //         })),
        //     onSuccess: (data) => {
        //         const akashaIds = [];
        //         data.collection.forEach((item) => {
        //             if (item.profile) {
        //                 akashaIds.push({ akashaId: item.profile.akashaId });
        //                 if (item.profile.avatar) {
        //                     item.profile.avatar =
        //                         imageCreator(item.profile.avatar, item.profile.baseUrl);
        //                 }
        //             }
        //         });
        //         this.profileService.saveAkashaIds(akashaIds);
        //         this.dispatch(profileActionCreators.moreFollowingIteratorSuccess(data, {
        //             fetchingMoreFollowing: false
        //         }));
        //     }
        // });
    };
    getFollowingsList = (akashaId) => {
        // this.profileService.getFollowingsList({
        //     akashaId,
        //     onSuccess: data => this.dispatch(profileActionCreators.getFollowingsListSuccess(data)),
        //     onError: error => this.dispatch(profileActionCreators.getFollowingsListError(error))
        // });
    }
    addUpdateProfileDataAction = (profileData) => {
        this.appActions.addPendingAction({
            type: 'updateProfile',
            payload: { profileData },
            titleId: 'updateProfileTitle',
            messageId: 'updateProfile',
            gas: 2000000,
            status: 'checkAuth'
        });
    }

    addFollowProfileAction = (akashaId, profile) => {
        this.appActions.addPendingAction({
            type: 'followProfile',
            payload: { akashaId, profile },
            titleId: 'followProfileTitle',
            messageId: 'followProfile',
            gas: 2000000,
            status: 'checkAuth'
        });
    };

    addUnfollowProfileAction = (akashaId, profile) => {
        this.appActions.addPendingAction({
            type: 'unfollowProfile',
            payload: { akashaId, profile },
            titleId: 'unfollowProfileTitle',
            messageId: 'unfollowProfile',
            gas: 2000000,
            status: 'checkAuth'
        });
    };

    addSendTipAction = (payload) => {
        this.appActions.addPendingAction({
            type: 'sendTip',
            payload,
            titleId: 'sendTipTitle',
            messageId: 'sendTip',
            gas: 2000000,
            status: 'needTransferConfirmation'
        });
    };

    followProfile = (akashaId, gas, profile) =>
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const flagOn = { akashaId, value: true };
            const flagOff = { akashaId, value: false };
            this.dispatch(profileActionCreators.followProfile({ followPending: flagOn }));
            // this.profileService.follow({
            //     token: loggedProfile.get('token'),
            //     akashaId,
            //     gas,
            //     onSuccess: (data) => {
            //         this.transactionActions.listenForMinedTx();
            //         this.transactionActions.addToQueue([{
            //             tx: data.tx,
            //             type: 'followProfile',
            //             akashaId: data.akashaId,
            //             followedProfile: profile
            //         }]);
            //         this.appActions.showNotification({
            //             id: 'followingProfile',
            //             values: { akashaId: data.akashaId },
            //             duration: 3000
            //         });
            //     },
            //     onError: error =>
            //         dispatch(profileActionCreators.followProfileError(error, {
            //             followPending: flagOff
            //         }))
            // });
        });

    followProfileSuccess = (akashaId, profile) => {
        this.dispatch(profileActionCreators.followProfileSuccess(profile, {
            followPending: { akashaId, value: false }
        }));
        this.appActions.showNotification({
            id: 'followProfileSuccess',
            values: { akashaId }
        });
    };

    unfollowProfile = (akashaId, gas, profile) =>
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const flagOn = { akashaId, value: true };
            const flagOff = { akashaId, value: false };
            this.dispatch(profileActionCreators.unfollowProfile({ followPending: flagOn }));
            // this.profileService.unfollow({
            //     token: loggedProfile.get('token'),
            //     akashaId,
            //     gas,
            //     onSuccess: (data) => {
            //         this.transactionActions.listenForMinedTx();
            //         this.transactionActions.addToQueue([{
            //             tx: data.tx,
            //             type: 'unfollowProfile',
            //             akashaId: data.akashaId,
            //             unfollowedProfile: profile
            //         }]);
            //         this.appActions.showNotification({
            //             id: 'unfollowingProfile',
            //             values: { akashaId: data.akashaId },
            //             duration: 3000
            //         });
            //     },
            //     onError: error =>
            //         dispatch(profileActionCreators.unfollowProfileError(error, flagOff))
            // });
        });

    unfollowProfileSuccess = (akashaId, profile) => {
        this.dispatch(profileActionCreators.unfollowProfileSuccess(profile, {
            followPending: { akashaId, value: false }
        }));
        this.appActions.showNotification({
            id: 'unfollowProfileSuccess',
            values: { akashaId }
        });
    };

    isFollower = (akashaId, following) => {
        this.dispatch(profileActionCreators.isFollower({
            isFollowerPending: true
        }));
        // this.profileService.isFollower({
        //     akashaId,
        //     following,
        //     onSuccess: data =>
        //         this.dispatch(profileActionCreators.isFollowerSuccess(data, {
        //             isFollowerPending: false
        //         })),
        //     onError: error =>
        //         this.dispatch(profileActionCreators.isFollowerError(error, {
        //             isFollowerPending: false
        //         }))
        // });
    };

    sendTip = (akashaId, receiver, value, gas) =>
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            const flagOn = { akashaId, value: true };
            const flagOff = { akashaId, value: false };
            this.dispatch(profileActionCreators.sendTip({ sendingTip: flagOn }));
            // this.profileService.sendTip({
            //     token: loggedProfile.get('token'),
            //     akashaId,
            //     receiver,
            //     value,
            //     gas,
            //     onSuccess: (data) => {
            //         this.transactionActions.listenForMinedTx();
            //         this.transactionActions.addToQueue([{
            //             tx: data.tx,
            //             type: 'sendTip',
            //             akashaId: data.akashaId,
            //             gas
            //         }]);
            //         this.appActions.showNotification({
            //             id: 'sendingTip',
            //             values: { akashaId: data.akashaId },
            //             duration: 3000
            //         });
            //     },
            //     onError: error =>
            //         dispatch(profileActionCreators.sendTipError(error, flagOff))
            // });
        });

    sendTipSuccess = (akashaId, minedSuccessfully) => {
        this.dispatch(profileActionCreators.sendTipSuccess({
            sendingTip: { akashaId, value: false }
        }));
        this.appActions.showNotification({
            id: minedSuccessfully ? 'sendTipSuccess' : 'sendTipError',
            values: { akashaId }
        });
    };

    clearFollowers = akashaId =>
        this.dispatch(profileActionCreators.clearFollowers(akashaId));

    clearFollowing = akashaId =>
        this.dispatch(profileActionCreators.clearFollowing(akashaId));
}

export { ProfileActions };

export const profileAddFollowAction = payload =>
    action(types.PROFILE_ADD_FOLLOW_ACTION, { payload });
export const profileAddTipAction = payload =>
    action(types.PROFILE_ADD_TIP_ACTION, { payload });
export const profileAddUnfollowAction = payload =>
    action(types.PROFILE_ADD_UNFOLLOW_ACTION, { payload });

export const profileClearLocal = () => action(types.PROFILE_CLEAR_LOCAL);
export const profileClearLoginErrors = () => action(types.PROFILE_CLEAR_LOGIN_ERRORS);
export const profileCreateEthAddress = data => action(types.PROFILE_CREATE_ETH_ADDRESS, { data });

export const profileCreateEthAddressError = (error) => {
    error.code = 'PCEAE01';
    error.messageId = 'profileCreateEthAddress';
    return action(types.PROFILE_CREATE_ETH_ADDRESS_ERROR, { error });
};

export const profileCreateEthAddressSuccess = data =>
    action(types.PROFILE_CREATE_ETH_ADDRESS_SUCCESS, { data });
export const profileDeleteLogged = () => action(types.PROFILE_DELETE_LOGGED);

export const profileDeleteLoggedError = (error) => {
    error.code = 'PDLE01';
    error.messageId = 'profileDeleteError';
    return action(types.PROFILE_DELETE_LOGGED_ERROR);
};

export const profileDeleteLoggedSuccess = () => action(types.PROFILE_DELETE_LOGGED_SUCCESS);
export const profileFollow = (akashaId, gas) =>
    action(types.PROFILE_FOLLOW, { akashaId, gas });

export const profileFollowError = (error, request) => {
    error.code = 'PFE01';
    error.messageId = 'profileFollow';
    return action(types.PROFILE_FOLLOW_ERROR, { error, request });
};

export const profileFollowersIterator = akashaId =>
    action(types.PROFILE_FOLLOWERS_ITERATOR, { akashaId });

export const profileFollowersIteratorError = (error, request) => {
    error.code = 'PFIE01';
    error.messageId = 'profileFollowersIterator';
    return action(types.PROFILE_FOLLOWERS_ITERATOR_ERROR, { error, request });
};

export const profileFollowersIteratorSuccess = data =>
    action(types.PROFILE_FOLLOWERS_ITERATOR_SUCCESS, { data });
export const profileFollowingsIterator = akashaId =>
    action(types.PROFILE_FOLLOWINGS_ITERATOR, { akashaId });

export const profileFollowingsIteratorError = (error, request) => {
    error.code = 'PFIE02';
    error.messageId = 'profileFollowingsIterator';
    return action(types.PROFILE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
};

export const profileFollowingsIteratorSuccess = data =>
    action(types.PROFILE_FOLLOWINGS_ITERATOR_SUCCESS, { data });
export const profileFollowSuccess = data => action(types.PROFILE_FOLLOW_SUCCESS, { data });
export const profileGetBalance = () => action(types.PROFILE_GET_BALANCE);

export const profileGetBalanceError = (error) => {
    error.code = 'PGBE01';
    error.messageId = 'profileGetBalance';
    return action(types.PROFILE_GET_BALANCE_ERROR, { error });
};

export const profileGetBalanceSuccess = data => action(types.PROFILE_GET_BALANCE_SUCCESS, { data });

export const profileGetCurrent = () => action(types.PROFILE_GET_CURRENT);

export const profileGetCurrentError = (error) => {
    error.code = 'PGCE01';
    error.messageId = 'profileGetCurrent';
    return action(types.PROFILE_GET_CURRENT_ERROR, { error });
};

export const profileGetCurrentSuccess = data => action(types.PROFILE_GET_CURRENT_SUCCESS, { data });
export const profileGetData = (akashaId, full) => action(types.PROFILE_GET_DATA, { akashaId, full });

export const profileGetDataError = (error) => {
    error.code = 'PGDE01';
    error.messageId = 'profileGetData';
    return action(types.PROFILE_GET_DATA_ERROR, { error });
};

export const profileGetDataSuccess = data => action(types.PROFILE_GET_DATA_SUCCESS, { data });
export const profileGetList = profileAddresses =>
    action(types.PROFILE_GET_LIST, { profileAddresses });

export const profileGetListError = (error) => {
    error.code = 'PGLE02';
    error.messageId = 'profileGetList';
    return action(types.PROFILE_GET_LIST_ERROR, { error });
};

export const profileGetListSuccess = data => action(types.PROFILE_GET_LIST_SUCCESS, { data });
export const profileGetLocal = () => action(types.PROFILE_GET_LOCAL);

export const profileGetLocalError = (error) => {
    error.code = 'PGLE01';
    error.messageId = 'profileGetLocal';
    return action(types.PROFILE_GET_LOCAL_ERROR, { error });
};

export const profileGetLocalSuccess = data => action(types.PROFILE_GET_LOCAL_SUCCESS, { data });
export const profileGetLogged = () => action(types.PROFILE_GET_LOGGED);

export const profileGetLoggedError = (error) => {
    error.code = 'PGLE02';
    error.messageId = 'profileGetLogged';
    return action(types.PROFILE_GET_LOGGED_ERROR, { error });
};

export const profileGetLoggedSuccess = data => action(types.PROFILE_GET_LOGGED_SUCCESS, { data });
export const profileIsFollower = followings => action(types.PROFILE_IS_FOLLOWER, { followings });

export const profileIsFollowerError = (error, request) => {
    error.code = 'PIFE01';
    error.messageId = 'profileIsFollower';
    return action(types.PROFILE_IS_FOLLOWER_ERROR, { error, request });
};

export const profileIsFollowerSuccess = data =>
    action(types.PROFILE_IS_FOLLOWER_SUCCESS, { data });
export const profileLogin = data => action(types.PROFILE_LOGIN, { data });

export const profileLoginError = (error) => {
    // this error should be treated locally (in the login form) instead of globally
    error.code = 'PLIE01';
    return action(types.PROFILE_LOGIN_ERROR, { error });
};

export const profileLoginSuccess = data => action(types.PROFILE_LOGIN_SUCCESS, { data });
export const profileLogout = () => action(types.PROFILE_LOGOUT);

export const profileLogoutError = (error) => {
    error.code = 'PLOE01';
    error.messageId = 'profileLogout';
    return action(types.PROFILE_LOGOUT_ERROR);
};

export const profileLogoutSuccess = () => action(types.PROFILE_LOGOUT_SUCCESS);
export const profileMoreFollowersIterator = akashaId =>
    action(types.PROFILE_MORE_FOLLOWERS_ITERATOR, { akashaId });

export const profileMoreFollowersIteratorError = (error, request) => {
    error.code = 'PMFIE01';
    error.messageId = 'profileMoreFollowersIterator';
    return action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_ERROR, { error, request });
};

export const profileMoreFollowersIteratorSuccess = data =>
    action(types.PROFILE_MORE_FOLLOWERS_ITERATOR_SUCCESS, { data });
export const profileMoreFollowingsIterator = akashaId =>
    action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR, { akashaId });

export const profileMoreFollowingsIteratorError = (error, request) => {
    error.code = 'PMFIE02';
    error.messageId = 'profileMoreFollowingsIterator';
    return action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_ERROR, { error, request });
};

export const profileMoreFollowingsIteratorSuccess = data =>
    action(types.PROFILE_MORE_FOLLOWINGS_ITERATOR_SUCCESS, { data });
export const profileResolveIpfsHash = (ipfsHash, columnId, akashaIds) =>
    action(types.PROFILE_RESOLVE_IPFS_HASH, { ipfsHash, columnId, akashaIds });

export const profileResolveIpfsHashError = (error, req) => {
    error.code = 'PRIHE01';
    error.messageId = 'profileResolveIpfsHash';
    return action(types.PROFILE_RESOLVE_IPFS_HASH_ERROR, { error, req });
};

export const profileResolveIpfsHashSuccess = (data, req) =>
    action(types.PROFILE_RESOLVE_IPFS_HASH_SUCCESS, { data, req });

export const profileSaveAkashaIdsError = (error) => {
    error.code = 'PSAIE01';
    error.messageId = 'profileSaveAkashaIds';
    return action(types.PROFILE_SAVE_AKASHA_IDS_ERROR, { error });
};

export const profileSaveLoggedError = (error) => {
    error.code = 'PSLE01';
    error.fatal = true;
    return action(types.PROFILE_SAVE_LOGGED_ERROR, { error });
};

export const profileSendTip = (akashaId, receiver, value, gas) =>
    action(types.PROFILE_SEND_TIP, { akashaId, receiver, value, gas });

export const profileSendTipError = (error, request) => {
    error.code = 'PSTE01';
    error.messageId = 'profileSendTip';
    return action(types.PROFILE_SEND_TIP_ERROR, { error, request });
};

export const profileSendTipSuccess = data => action(types.PROFILE_SEND_TIP_SUCCESS, { data });

export const profileToggleInterest = (interest, interestType) =>
     action(types.PROFILE_TOGGLE_INTEREST, { interest, interestType });

export const profileUnfollow = (akashaId, gas) =>
    action(types.PROFILE_UNFOLLOW, { akashaId, gas });

export const profileUnfollowError = (error, request) => {
    error.code = 'PUE01';
    error.messageId = 'profileUnfollow';
    return action(types.PROFILE_UNFOLLOW_ERROR, { error, request });
};

export const profileUnfollowSuccess = data => action(types.PROFILE_UNFOLLOW_SUCCESS, { data });

export const profileUpdateLoggedError = (error) => {
    error.code = 'PULE01';
    error.messageId = 'profileUpdateLogged';
    return action(types.PROFILE_UPDATE_LOGGED_ERROR, { error });
};
