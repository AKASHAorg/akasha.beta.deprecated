import { AuthService, RegistryService, ProfileService } from '../services';
import { tempProfileActionCreators, profileActionCreators } from './action-creators';

let tempProfileActions = null;

class TempProfileActions {
    constructor (dispatch) {
        if (!tempProfileActions) {
            tempProfileActions = this;
        }
        this.authService = new AuthService();
        this.profileService = new ProfileService();
        this.registryService = new RegistryService();
        this.dispatch = dispatch;
        return tempProfileActions;
    }
    /**
     *
     *  Step 1:  Create temp profile
     *  Saves a temporary profile to indexedDB
     */

    createTempProfile = (profileData, nextAction = 'createEthAddress') => {
        this.dispatch(tempProfileActionCreators.createTempProfile(profileData));
        this.registryService.createTempProfile({
            profileData,
            currentStatus: {
                nextAction
            },
            onSuccess: () => {
                this.dispatch(
                    tempProfileActionCreators.createTempProfileSuccess(profileData, nextAction)
                );
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
                console.log('createEthAddress', tempProfile);
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
        this.dispatch(tempProfileActionCreators.requestFundFromFaucet());
        if (address && !tempProfile.getIn(['currentStatus', 'faucetRequested'])) {
            this.dispatch((dispatch) => {
                console.log('requestFund', tempProfile);
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
     *  @param akashaId <string> Profile akashaId
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
            akashaId,
            firstName,
            lastName,
            avatar,
            about,
            links,
            backgroundImage
        } = tempProfile.toJS();
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
                    akashaId,
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
            this.tempLogin({
                account: tempProfile.get('address'),
                password: tempProfile.get('password'),
                rememberTime: 1
            });
        }
    }

    updateTempProfile = (changes, currentStatus, cb) => {
        console.log('updateTemp', currentStatus);
        this.registryService.updateTempProfile({
            changes,
            currentStatus,
            onSuccess: (tempProfile) => {
                tempProfileActionCreators.updateTempProfileSuccess(tempProfile);
                if (typeof cb === 'function') {
                    cb();
                }
            },
            onError: (error) => {
                console.error(error, 'update error');
                this.dispatch(tempProfileActionCreators.updateTempProfileError(error));
            }
        });
    };

    deleteTempProfile = akashaId =>
        this.registryService.deleteTempProfile({
            akashaId,
            onError: error =>
                this.dispatch(tempProfileActionCreators.deleteTempProfileError(error)),
            onSuccess: () => this.dispatch(tempProfileActionCreators.deleteTempProfileSuccess())
        });

    getTempProfile = () =>
        this.registryService.getTempProfile({
            onError: (error) => {
                console.error(error, 'getTempProfile')
                this.dispatch(tempProfileActionCreators.getTempProfileError(error));
            },
            onSuccess: data => this.dispatch(tempProfileActionCreators.getTempProfileSuccess(data))
        });

    tempLogin = ({ account, password, rememberTime, registering = true }) => {
        password = new TextEncoder('utf-8').encode(password);
        console.log('tempLogin', account);
        this.dispatch(tempProfileActionCreators.login());
        this.authService.login({
            account,
            password,
            rememberTime,
            registering,
            onSuccess: data => this.dispatch(profileActionCreators.loginSuccess(data)),
            onError: error => this.dispatch(profileActionCreators.loginError(error))
        });
    };
    clearErrors = () => {
        this.dispatch(tempProfileActionCreators.clearErrors());
    }
}

export { TempProfileActions };
