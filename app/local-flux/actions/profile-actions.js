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
        password = new TextEncoder('utf-8').encode(password);
        this.dispatch(profileActionCreators.login());
        this.authService.login({
            account,
            password,
            rememberTime,
            onSuccess: data => this.dispatch(profileActionCreators.loginSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.loginError(error))
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

    getLoggedProfile = () =>
        this.authService.getLoggedProfile({
            onSuccess: data => this.dispatch(profileActionCreators.getLoggedProfileSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.getLoggedProfileError(error))
        });

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
    publishProfile = (tempProfile, loggedProfile, loginRequested, gas) => {
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
            ipfs.avatar = Array.from(avatar);
        }
        if (backgroundImage.length > 0) {
            ipfs.backgroundImage = backgroundImage[0];
        }
        dbg('sending ipfs object avatar', ipfs.avatar.slice(0));
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
        } else if (!loginRequested) {
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

    deleteTempProfile = username =>
        this.registryService.deleteTempProfile({
            username,
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
    // this method is only called to check if there is a logged profile
    // it does not dispatch anything and is useless as an action
    //
    checkLoggedProfile = (cb) => {
        this.dispatch((dispatch, getState) => {
            const loggedProfile = getState().profileState.get('loggedProfile');
            if (loggedProfile.get('account')) {
                return cb(null, true);
            }
            this.authService.getLoggedProfile({
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
}
export { ProfileActions };
