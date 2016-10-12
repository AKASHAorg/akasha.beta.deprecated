import { hashHistory } from 'react-router';
import debug from 'debug';
import { ProfileService, AuthService, RegistryService, TransactionService } from '../services';
import { profileActionCreators } from './action-creators';

const dbg = debug('App:ProfileActions:');
let profileActions = null;

class ProfileActions {
    constructor (dispatch) {
        if (!profileActions) {
            profileActions = this;
        }
        this.profileService = new ProfileService();
        this.authService = new AuthService();
        this.registryService = new RegistryService();
        this.transactionService = new TransactionService();
        this.dispatch = dispatch;
        return profileActions;
    }
    login = ({ account, password, rememberTime }) => {
        dbg('logging in with:', account, 'for', rememberTime, 'minutes');
        this.authService.login({
            account,
            password,
            rememberTime,
            onSuccess: data => this.dispatch(profileActionCreators.loginSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.loginError(error))
        });
    };

    logout = (account) => {
        this.profileService.logout(account).then((result) => {
            this.dispatch(profileActionCreators.logoutSuccess(result));
        })
        .then(() => {
            this.profileService.removeLoggedProfile().then(() => {
                hashHistory.push('authenticate');
            });
        }).catch(reason => profileActionCreators.logoutError(reason));
    };

    checkLoggedProfile = (options = {}) =>
        this.profileService.getLoggedProfile().then((loggedProfile) => {
            const profile = loggedProfile[0];
            if (profile) {
                this.dispatch(profileActionCreators.loginSuccess(profile));
                if (options.redirect) {
                    return hashHistory.push(`/${profile.username}`);
                }
            }
            return null;
        });
    clearLoggedProfile = () => {
        this.profileService.clearLoggedProfile();
    }

    resumeProfileCreation = () => {
        this.dispatch((dispatch, getState) => {
            const updatedTempProfile = getState().profileState.get('tempProfile');
            const updatedStatus = updatedTempProfile.get('currentStatus');
            const { nextAction, faucetTx } = updatedStatus;
            const loggedProfile = getState().profileState.get('loggedProfile');
            const isLoggedIn = loggedProfile.get('account') === updatedTempProfile.get('address') &&
                Date.parse(loggedProfile.get('expiration')) > Date.now();
            const minedTransactions = getState().transactionState.get('mined');
            dbg('resuming current step', nextAction);
            switch (nextAction) {
                case 'CREATE_TEMP_PROFILE':
                    // create eth address in this step and update temp profile;
                    this.createEthAddress();
                    break;
                case 'CREATE_ETH_ADDRESS_SUCCESS':
                    // request from faucet in this step and update temp profile
                    this.requestFundFromFaucet();
                    break;
                case 'REQUEST_FUND_FROM_FAUCET_SUCCESS': {
                    const isMined = minedTransactions.findIndex(trans => trans.tx === faucetTx) !== -1;
                    if (isMined) {
                        if (isLoggedIn) {
                            this.publishProfile(loggedProfile.get('token'));
                        } else {
                            this.login({
                                account: updatedTempProfile.get('address'),
                                password: updatedTempProfile.get('password'),
                                rememberTime: 1
                            });
                        }
                    }
                    break;
                }
                case 'COMPLETE_PROFILE_CREATION_SUCCESS': {
                    break;
                }
                default:
                    break;
            }
        });
    }
    /**
     * ---------Start New Profile Registration -----------
     *
     *  Step 1:  Create temp profile
     *  Saves a temporary profile to indexedDB
     */
    createTempProfile = (profileData) => {
        dbg('creating temp profile', profileData);
        this.dispatch(profileActionCreators.createTempProfile(profileData));
        this.registryService.createTempProfile({
            profileData,
            currentStatus: {
                nextAction: 'createEthAddress'
            },
            onSuccess: (data) => {
                dbg('createTempProfileSuccess', data);
                this.dispatch(profileActionCreators.createTempProfileSuccess(profileData));
            },
            onError: (error) => {
                dbg('createTempProfileError', error);
                this.dispatch(
                    profileActionCreators.createTempProfileError(error)
                );
            }
        });
    }
    /**
     * Step 2: Create Eth address
     * Creates a new ethereum address through Auth Service
     * Request:
     * @param  password <Uint8Array> User created password
     * Response:
     * @param data.address <String> Generated Ethereum address
     */
    createEthAddress = (tempProfile) => {
        const currentStatus = tempProfile.get('currentStatus');
        const password = tempProfile.get('password');

        if (!tempProfile.get('address') && !currentStatus.get('ethAddressRequested')) {
            this.dispatch(profileActionCreators.createEthAddress());
            this.dispatch((dispatch) => {
                dbg('creating eth address for password', password);
                this.authService.createEthAddress({
                    password,
                    onSuccess: (data) => {
                        dbg('createEthAddressSuccess', data);
                        this.updateTempProfile(data, { nextAction: 'requestFundFromFaucet' }, () => {
                            dispatch(profileActionCreators.createEthAddressSuccess(data));
                        });
                    },
                    onError: (error) => {
                        dbg('createEthAddressError', error);
                        dispatch(profileActionCreators.createEthAddressError(error));
                    }
                });
            });
        }
    }
    /**
     * Step 3: Request fund from faucet;
     * Request some ethers from a temporary faucet (ONLY IN TESTNET!)
     * Request:
     * @param address
     * Response:
     * @param data.tx <string> Transaction hash which must be watched
     */
    requestFundFromFaucet = (tempProfile) => {
        const address = tempProfile.get('address');
        if (address && !tempProfile.getIn(['currentStatus', 'faucetRequested'])) {
            this.dispatch(profileActionCreators.requestFundFromFaucet());
            this.dispatch((dispatch) => {
                dbg('requesting funds for address', address);
                this.authService.requestEther({
                    address,
                    onSuccess: (data) => {
                        dbg('requestFundFromFaucetSuccess', data);
                        const newStatus = tempProfile.get('currentStatus').merge({
                            nextAction: 'listenFaucetTx',
                            faucetTx: data.tx
                        });
                        this.updateTempProfile({}, newStatus.toJS(), () => {
                            dispatch(profileActionCreators.requestFundFromFaucetSuccess(data));
                        });
                    },
                    onError: (error) => {
                        dbg('requestFundFromFaucetError', error);
                        dispatch(profileActionCreators.requestFundFromFaucetError(error));
                    }
                });
            });
        }
    }
    listenFaucetTx = () => {
        this.dispatch(profileActionCreators.listenFaucetTx());
    }
    listenPublishTx = () => {
        this.dispatch(profileActionCreators.listenPublishTx());
    }
    /**
     *  Step 4: Send profile data for registration
     *  Finish profile publishing through Registry Service
     *  Request:
     *  @param username <string> Profile username
     *  @param ipfs <object> Profile data (firstName, lastName, avatar?, backgroundImage?, about?, links? )
     *  Response:
     *  @param data.tx <string> Transaction hash which needs to be watched for mining
     */
    publishProfile = (tempProfile, loggedProfile, gas) => {
        const isLoggedIn = loggedProfile.get('account') === tempProfile.get('address') &&
            Date.parse(loggedProfile.get('expiration')) > Date.now();
        const { publishRequested } = tempProfile.get('currentStatus');
        const { username, firstName, lastName, avatar, about, links, backgroundImage } = tempProfile;
        const ipfs = {
            firstName,
            lastName,
            about
        };

        if (links) {
            ipfs.links = links;
        }
        if (avatar) {
            ipfs.avatar = avatar;
        }
        if (backgroundImage.length > 0) {
            ipfs.backgroundImage = backgroundImage[0];
        }
        dbg('sending ipfs object', ipfs);
        if (isLoggedIn && !publishRequested) {
            this.dispatch(profileActionCreators.publishProfile());
            this.dispatch((dispatch) => {
                this.registryService.registerProfile({
                    token: loggedProfile.get('token'),
                    username,
                    ipfs,
                    gas,
                    onSuccess: (data) => {
                        dbg('publishProfileSuccess', data);
                        const newStatus = tempProfile.get('currentStatus').merge({
                            nextAction: 'listenPublishTx',
                            publishTx: data.tx
                        });
                        this.updateTempProfile({}, newStatus.toJS(), () => {
                            dispatch(profileActionCreators.publishProfileSuccess(data));
                        });
                    },
                    onError: (error) => {
                        dbg('publishProfileError', error);
                        dispatch(profileActionCreators.publishProfileError(error));
                    }
                });
            });
        } else {
            dbg('logging in!');
            this.login({
                account: tempProfile.get('address'),
                password: tempProfile.get('password'),
                rememberTime: 1
            });
        }
    }
    /**
     *  ----------- End Profile Registration --------------
     */
    /**
     * -------------  Temp profile utilities -------------
     */
    updateTempProfile = (changes, currentStatus, cb) => {
        this.registryService.updateTempProfile({
            changes,
            currentStatus,
            onSuccess: (tempProfile) => {
                profileActionCreators.updateTempProfileSuccess(tempProfile);
                cb();
            },
            onError: (error) => {
                this.dispatch(profileActionCreators.updateTempProfileError(error));
            }
        });
    };

    deleteTempProfile = () =>
        this.registryService.deleteTempProfile({
            onError: error => this.dispatch(profileActionCreators.deleteTempProfileError(error)),
            onSuccess: () => this.dispatch(profileActionCreators.deleteTempProfileSuccess())
        })

    getTempProfile = () =>
        this.registryService.getTempProfile({
            onError: (error) => {
                this.dispatch(profileActionCreators.getTempProfileError(error));
            },
            onSuccess: data => this.dispatch(profileActionCreators.getTempProfileSuccess(data))
        });
    /**
     *  ----- End Temp Profile utilities ---------
     */
    getLocalProfiles = () =>
        this.authService.getLocalIdentities({
            onSuccess: (data) => {
                this.dispatch(profileActionCreators.getLocalProfilesSuccess(data));
                this.getProfileData(data);
            },
            onError: err => this.dispatch(profileActionCreators.getLocalProfilesError(err))
        });
    /**
     * profiles = [{key: string, profile: string}]
     */
    getProfileData = (profiles) => {
        for (let i = profiles.length - 1; i >= 0; i -= 1) {
            this.profileService.getProfileData({
                options: {
                    profile: profiles[i].profile,
                    full: false
                },
                onSuccess: (data) => {
                    this.dispatch(profileActionCreators.getProfileDataSuccess(data));
                },
                onError: (err) => {
                    this.dispatch(profileActionCreators.getProfileDataError(err));
                }
            });
        }
    };
    clearErrors = () => {
        this.dispatch(profileActionCreators.clearErrors());
    }
}
export { ProfileActions };
