import { AuthService, RegistryService } from '../services';
import { tempProfileActionCreators, profileActionCreators } from './action-creators';

let tempProfileActions = null;

class TempProfileActions {
    constructor (dispatch) {
        if (!tempProfileActions) {
            tempProfileActions = this;
        }
        this.authService = new AuthService();
        this.registryService = new RegistryService();
        this.dispatch = dispatch;
        return tempProfileActions;
    }
    /**
     *
     *  Step 1:  Create temp profile
     *  Saves a temporary profile to indexedDB
     */

    createTempProfile = (profileData) => {
        this.dispatch(tempProfileActionCreators.createTempProfile(profileData));
        this.registryService.createTempProfile({
            profileData,
            currentStatus: {
                nextAction: 'createEthAddress'
            },
            onSuccess: () => {
                this.dispatch(tempProfileActionCreators.createTempProfileSuccess(profileData));
            },
            onError: (error) => {
                this.dispatch(
                    tempProfileActionCreators.createTempProfileError(error)
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
            this.dispatch(tempProfileActionCreators.createEthAddress());
            this.dispatch((dispatch) => {
                this.authService.createEthAddress({
                    password,
                    onSuccess: (data) => {
                        this.updateTempProfile(data, { nextAction: 'requestFundFromFaucet' }, () => {
                            dispatch(tempProfileActionCreators.createEthAddressSuccess(data));
                        });
                    },
                    onError: (error) => {
                        dispatch(tempProfileActionCreators.createEthAddressError(error));
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
            this.dispatch(tempProfileActionCreators.requestFundFromFaucet());
            this.dispatch((dispatch) => {
                this.authService.requestEther({
                    address,
                    onSuccess: (data) => {
                        const newStatus = tempProfile.get('currentStatus').merge({
                            nextAction: 'listenFaucetTx',
                            faucetTx: data.tx
                        });
                        this.updateTempProfile({}, newStatus.toJS(), () => {
                            dispatch(tempProfileActionCreators.requestFundFromFaucetSuccess(data));
                        });
                    },
                    onError: (error) => {
                        dispatch(tempProfileActionCreators.requestFundFromFaucetError(error));
                    }
                });
            });
        }
    }
    listenFaucetTx = () => {
        this.dispatch(tempProfileActionCreators.listenFaucetTx());
    }
    listenPublishTx = () => {
        this.dispatch(tempProfileActionCreators.listenPublishTx());
    }
    /**
     *  Step 4: Send profile data for registration
     *  Finish profile publishing through Registry Service
     *  Request:
     *  @param username <string> Profile username
     *  @param ipfs <object> Profile data (firstName, lastName,
     *      avatar?, backgroundImage?, about?, links? )
     *  Response:
     *  @param data.tx <string> Transaction hash which needs to be watched for mining
     */
    publishProfile = (tempProfile, loggedProfile, loginRequested, gas) => {
        const isLoggedIn = loggedProfile.get('account') === tempProfile.get('address') &&
            Date.parse(loggedProfile.get('expiration')) > Date.now();
        const { publishRequested } = tempProfile.get('currentStatus');
        const {
            username,
            firstName,
            lastName,
            avatar,
            about,
            links,
            backgroundImage
        } = tempProfile;
        const ipfs = {
            firstName,
            lastName,
            about,
            avatar
        };

        if (links) {
            ipfs.links = links;
        }

        if (backgroundImage.length > 0) {
            ipfs.backgroundImage = backgroundImage[0];
        }
        if (isLoggedIn && !publishRequested) {
            this.dispatch(tempProfileActionCreators.publishProfile());
            this.dispatch((dispatch) => {
                this.registryService.registerProfile({
                    token: loggedProfile.get('token'),
                    username,
                    ipfs,
                    gas,
                    onSuccess: (data) => {
                        const newStatus = tempProfile.get('currentStatus').merge({
                            nextAction: 'listenPublishTx',
                            publishTx: data.tx
                        });
                        this.updateTempProfile({}, newStatus.toJS(), () => {
                            dispatch(tempProfileActionCreators.publishProfileSuccess(data));
                        });
                    },
                    onError: (error) => {
                        dispatch(tempProfileActionCreators.publishProfileError(error));
                    }
                });
            });
        } else if (!loginRequested) {
            this.login({
                account: tempProfile.get('address'),
                password: tempProfile.get('password'),
                rememberTime: 1
            });
        }
    }

    updateTempProfile = (changes, currentStatus, cb) => {
        this.registryService.updateTempProfile({
            changes,
            currentStatus,
            onSuccess: (tempProfile) => {
                tempProfileActionCreators.updateTempProfileSuccess(tempProfile);
                cb();
            },
            onError: (error) => {
                this.dispatch(tempProfileActionCreators.updateTempProfileError(error));
            }
        });
    };

    deleteTempProfile = username =>
        this.registryService.deleteTempProfile({
            username,
            onError: error => this.dispatch(tempProfileActionCreators.deleteTempProfileError(error)),
            onSuccess: () => this.dispatch(tempProfileActionCreators.deleteTempProfileSuccess())
        });

    getTempProfile = () =>
        this.registryService.getTempProfile({
            onError: (error) => {
                this.dispatch(tempProfileActionCreators.getTempProfileError(error));
            },
            onSuccess: data => this.dispatch(tempProfileActionCreators.getTempProfileSuccess(data))
        });

    login = ({ account, password, rememberTime }) => {
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
    clearErrors = () => {
        this.dispatch(tempProfileActionCreators.clearErrors());
    }
}

export { TempProfileActions };
