import { hashHistory } from 'react-router';
import debug from 'debug';
import { ProfileService, AuthService, RegistryService, TransactionService } from '../services';
import {
    profileActionCreators,
    transactionActionCreators } from './action-creators';

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
    login = ({ account, password, rememberTime }) =>
        this.authService.login({
            account,
            password,
            rememberTime,
            onSuccess: data => this.dispatch(profileActionCreators.loginSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.loginError(error))
        });

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
                currentStep: 0,
                success: true
            },
            onSuccess: (data) => {
                dbg('createTempProfileSuccess', data);
                this.dispatch(
                    profileActionCreators.createTempProfileSuccess(profileData)
                );
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
    createEthAddress = (password) => {
        this.dispatch(profileActionCreators.createEthAddress()); // currentStep: 1, success: false
        dbg('creating eth address for password', password);
        this.authService.createEthAddress({
            password,
            onSuccess: (data) => {
                dbg('createEthAddressSuccess', data);
                this.updateTempProfile(data);
                this.dispatch(profileActionCreators.createEthAddressSuccess(data));
            },
            onError: (error) => {
                dbg('createEthAddressError', error);
                this.dispatch(profileActionCreators.createEthAddressError(error));
            }
        });
    }
    /**
     * Step 3: Request fund from faucet;
     * Request some ethers from a temporary faucet (ONLY IN TESTNET!)
     * Request:
     * @param address
     * Response:
     * @param data.tx <string> Transaction hash which must be watched
     */
    requestFundFromFaucet = (address) => {
        dbg('requesting funds for address', address);
        this.dispatch(profileActionCreators.requestFundFromFaucet());
        this.authService.requestEther({
            address,
            onSuccess: (data) => {
                dbg('requestFundFromFaucetSuccess', data);
                this.updateTempProfile(data);
                this.dispatch(profileActionCreators.requestFundFromFaucetSuccess(data));
                this.watchForMined();
                this.addTxToQueue(data.tx, 'faucet');
            },
            onError: (error) => {
                dbg('requestFundFromFaucetError', error);
                this.dispatch(profileActionCreators.requestFundFromFaucetError(error));
            }
        });
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
    publishProfile = (authToken, profileData, gas) => {
        dbg('publishing profile', profileData, 'with token', authToken);
        this.dispatch(profileActionCreators.publishProfile());
        const { username, firstName, lastName, avatar, backgroundImage, about, links } = profileData;
        const ipfs = {
            firstName,
            lastName,
            avatar,
            backgroundImage,
            about,
            links
        };
        this.registryService.registerProfile({
            token: authToken,
            username,
            ipfs,
            gas,
            onSuccess: (data) => {
                dbg('publishProfileSuccess', data);
                this.updateTempProfile(data);
                this.dispatch(profileActionCreators.publishProfileSuccess(data));
                this.watchForMined();
                this.addTxToQueue(data.tx, 'publish');
            },
            onError: (error) => {
                dbg('publishProfileError', error)
                this.dispatch(profileActionCreators.publishProfileError(error));
            }
        });
    }


    /**
     *  ----------- End Profile Registration --------------
     */
    addTxToQueue = (tx, identifier) => {
        this.transactionService.addToQueue({
            tx: [{ tx }],
            onSuccess: ({ watching }) => {
                dbg('now watching', tx, 'for mined event');
                this.dispatch(transactionActionCreators.addToQueueSuccess([{ tx }]));
                if (identifier === 'faucet') {
                    this.updateTempProfile({
                        currentStatus: {
                            currentStep: 3,
                            success: false,
                            faucetTx: tx
                        }
                    });
                } else if (identifier === 'publish') {
                    this.updateTempProfile({
                        currentStatus: {
                            currentStep: 3,
                            success: false,
                            publishTx: tx
                        }
                    });
                }
            },
            onError: (error) => {
                dbg('cannot watch', tx, 'error:', error);
                this.dispatch(transactionActionCreators.addToQueueError(error));
                this.updateTempProfile({
                    currentStatus: {
                        currentStep: 2,
                        success: false,
                        error
                    }
                });
            }
        });
    }
    watchForMined = (identifier) => {
        this.transactionService.emitMined({
            onError: error => this.dispatch(transactionActionCreators.transactionMinedError(error)),
            onSuccess: minedTx => {
                this.dispatch(transactionActionCreators.transactionMinedSuccess(minedTx))
            }
        });
    }
    /**
     * -------------  Temp profile utilities -------------
     */
    updateTempProfile = changes =>
        this.registryService.updateTempProfile({
            changes,
            onSuccess: () => {
                this.dispatch(profileActionCreators.updateTempProfileSuccess(changes));
            },
            onError: (error) => {
                this.dispatch(profileActionCreators.updateTempProfileError(error));
            }
        });

    deleteTempProfile = () =>
        this.registryService.deleteTempProfile({
            onError: error => this.dispatch(profileActionCreators.deleteTempProfileError(error)),
            onSuccess: () => this.dispatch(profileActionCreators.deleteTempProfileSuccess())
        })

    getTempProfile = () =>
        this.registryService.getTempProfile({
            onError: error => this.dispatch(profileActionCreators.getTempProfileError(error)),
            onSuccess: data => this.dispatch(profileActionCreators.getTempProfileSuccess(data))
        });
    /**
     *  ----- End Temp Profile utilities ---------
     */
    getLocalProfiles = () =>
        this.dispatch((dispatch) => {
            this.authService.getLocalIdentities({
                onSuccess: data => this.getProfileData(data),
                onError: err => dispatch(profileActionCreators.getLocalProfilesError(err))
            });
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
    /**
     * get all local profiles available
     * returns only the address and userName
     */
    getProfilesList = () =>
        this.profileService.getProfilesList().then((profiles) => {
            dbg('getProfilesList', profiles);
            return this.dispatch(profileActionCreators.getProfilesListSuccess(profiles.data));
        }).catch(reason => this.dispatch(profileActionCreators.getProfilesListError(reason)));
}
export { ProfileActions };
