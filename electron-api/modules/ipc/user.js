const { ipcMain } = require('electron');
const MainService = require('./main');
const Dapple = require('../../../contracts.sol/build/js_module.js');
const request = require('request');
const Promise = require('bluebird');

/**
 * UserService class
 * It provides the Renderer with access to User instance.
 * It also registers events for the Renderer.
 *
 */
class UserService extends MainService {
    /*
     * @returns {UserService}
     */
    constructor () {
        super('user');
        this.IPFS_ADD_SIGNUP_FAIL = 'ipfs add user signup fail';
        this.NO_COINBASE_FAIL = 'no coinbase / no ethereum account';
        this.UNLOCK_COINBASE_FAIL = 'unlock account fail, check your password';
        this.password = 'zz';
        this.textFields = ['username', 'firstName', 'lastName', 'description'];
        this.CREATE_PROFILE_CONTRACT_GAS = 19000;
        this.UNLOCK_INTERVAL = 2000;
        this.FAUCET_URL = 'http://faucet.ma.cx:3000/donate/';
        this.ZERO_ADDR = '0x0000000000000000000000000000000000000000';
    }
    /*
     * It sets up the listeners for this module.
     * Events used are:
     * server:ipfs:startService used by the View layer to start the ipfs executable
     *
     * @param {BrowserWindow} mainWindow -- ignored for now
     * @returns undefined
     */
    setupListeners () {
        ipcMain.on(this.serverEvent.signUp, (event, arg) => {
            this._signUp(event, arg);
        });
        ipcMain.on(this.serverEvent.exists, (event, arg) => {
            this._usernameExists(event, arg);
        });
        ipcMain.on(this.serverEvent.createCoinbase, (event, arg) => {
            this._createCoinbase(event, arg);
        });
        ipcMain.on(this.serverEvent.faucetEther, (event, arg) => {
            this._faucetEther(event, arg);
        });
        ipcMain.on(this.serverEvent.registerProfile, (event, arg) => {
            this._signUp(event, arg);
        });
        ipcMain.on(this.serverEvent.listAccounts, (event, arg) => {
            this._listAccounts(event, arg);
        });
        ipcMain.on(this.serverEvent.getBalance, (event, arg) => {
            this._getBalance(event, arg);
        });
    }

    getPassword () {
        return this.password;
    }

    setPassword (password) {
        this.password = password;
    }

    _usernameExists (event, arg) {
        const web3 = this.__getWeb3();
        const registry = new Dapple.class(web3).objects.registry;
        registry.getById.call(web3.fromUtf8(arg.username), {

        }, (err, res) => {
            if (!err) {
                this._sendEvent(event)(this.clientEvent.exists, true, res);
            }
        });
    }

    _createCoinbase (event, arg) {
        const web3 = this.__getWeb3();
        web3.personal.newAccountAsync(arg.password).then((data) => {
            this._sendEvent(event)(this.clientEvent.createCoinbase, true, data);
        });
    }
    /**
    * @param {Object} event, {Object} arg
    * ex: arg = {account: '0x23948239489249823498'}
    */
    _getBalance (event, arg) {
        const web3 = this.__getWeb3();
        web3.eth.getBalanceAsync(arg.account).then((data) => {
            this._sendEvent(event)(this.clientEvent.getBalance, true, data);
        });
    }

    _listAccounts (event, arg) {
        const web3 = this.__getWeb3();
        const profilePromises = [];
        web3.personal.getListAccountsAsync().then((data) => {
            const akashaContracts = new Dapple.class(web3);
            const registry = akashaContracts.objects.registry;
            const profile = akashaContracts.classes.AkashaProfile;
            const getByAddrPromise = Promise.promisify(registry.getByAddr.call);
            for (let i = 0; i < data.length; i++) {
                const ethAccount = data[i];
                profilePromises.push(
                    getByAddrPromise(ethAccount)
                    .then(
                        (
                            (eth) => (profileContractAddress) => {
                                return {
                                    eth,
                                    profileContractAddress
                                };
                            }
                        )(ethAccount)
                    )
                );
            }

            Promise.all(profilePromises).then((results) => {
                for (let i = 0; i < results.length; i++) {
                    const akashaProfileContractHash = results[i].profileContractAddress;
                    const ethAccount = results[i].ethAccount;
                    if (akashaProfileContractHash !== this.ZERO_ADDR) {
                        profile
                            .at(akashaProfileContractHash)
                            .getIpfs
                            .call(((ethAddress) => {
                                return (err, tuple) => {
                                    const ipfsHash = web3.toUtf8(tuple[0]) + web3.toUtf8(tuple[1]);
                                    this.
                                        _getIpfsAPI()
                                        .cat({
                                            id: ipfsHash,
                                            encoding: 'utf8'
                                        })
                                        .then((result) => {
                                            this._sendEvent(event)(
                                                this.clientEvent.listAccounts,
                                                true,
                                                Object.assign({ ethAddress, result }, data)
                                            );
                                        })
                                        .catch((ipfsErr) => {
                                            this._sendEvent(event)(
                                                this.clientEvent.listAccounts,
                                                false,
                                                ipfsErr);
                                        });
                                };
                            })(ethAccount));
                    }
                }
            });
        });
    }

    _faucetEther (event, arg) {
        const URL = this.FAUCET_URL + arg.account; // eslint-disable-line prefer-template
        request({
            uri: URL,
            method: 'GET',
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 4
        }, (error, response, body) => {
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            if (body && body.txhash) {
                this.
                    _sendEvent(event)(this.clientEvent.faucetEther, true, body.txhash);
            }
            this
                .__getGeth()
                .addFilter('tx', body.txhash, (txInfo) => {
                    this.
                        _sendEvent(event)(this.clientEvent.faucetEther, true, txInfo);
                });
        });
    }

    _uploadImages (signupJSON) {
        const imagePromises = [];
        if (signupJSON.avatar) {
            imagePromises.push(this._uploadImage('avatar', signupJSON.avatar));
        }
        if (signupJSON.bg1) {
            imagePromises.push(this._uploadImage('bg1', signupJSON.bg1));
        }
        if (signupJSON.bg2) {
            imagePromises.push(this._uploadImage('bg2', signupJSON.bg2));
        }
        if (signupJSON.bg3) {
            imagePromises.push(this._uploadImage('bg3', signupJSON.bg3));
        }
        if (signupJSON.bg4) {
            imagePromises.push(this._uploadImage('bg4', signupJSON.bg4));
        }
        return Promise.all(imagePromises).then((data) => {
            const imageHashes = {};
            for (const result of data) {
                imageHashes[result.name] = result.hash;
            }
            return imageHashes;
        }).catch((err) => err);
    }

    _signUp (event, arg) {
        this
        ._uploadImages(arg)
        .then((imageHashes) => {
            const fullProfileJSON = Object.assign({}, imageHashes);
            for (const key of this.textFields) {
                fullProfileJSON[key] = arg[key];
            }
            return this._addToIpfs({
                data: JSON.stringify(fullProfileJSON)
            })
            .then((response) => {
                const ipfsHash = response[0].Hash;
                const web3 = this.__getWeb3();
                web3.eth.getCoinbaseAsync().then((res) => {
                    web3
                        .personal
                        .unlockAccountAsync(arg.account, arg.password, this.UNLOCK_INTERVAL)
                        .then(() => {
                            const registry = new Dapple.class(web3).objects.registry;
                            const ipfsHashDelimiter = Math.floor(ipfsHash.length / 2);
                            registry.register(
                                web3.fromUtf8(arg.username),
                                [
                                    ipfsHash.substring(0, ipfsHashDelimiter),
                                    ipfsHash.substring(ipfsHashDelimiter)
                                ],
                                {
                                    gas: this.CREATE_PROFILE_CONTRACT_GAS
                                }, (error, tx) => {
                                    this._sendEvent(event)(
                                        this.clientEvent.registryRegisterHash,
                                        true,
                                        tx); // o sa ii pasez si currentblock
                                    if (!error) {
                                        this
                                            .__getGeth()
                                            .addFilter('tx', tx, (txInfo) => {
                                                this.
                                                    _sendEvent(event)(this.clientEvent.signUp,
                                                                        true,
                                                                        txInfo);
                                            });
                                    }
                                });
                        }).catch((err) => {
                            this._sendEvent(event)(this.clientEvent.signUp,
                                                false,
                                                this.UNLOCK_COINBASE_FAIL);
                        });
                }).catch((err) => {
                    this._sendEvent(event)(this.clientEvent.signUp, false, this.NO_COINBASE_FAIL);
                });
            })
            .catch((err) => {
                this._sendEvent(event)(this.clientEvent.signUp, false, this.IPFS_ADD_SIGNUP_FAIL);
            });
        })
            .catch((err) => {
                this._sendEvent(event)(this.clientEvent.signUp, false, this.IPFS_ADD_SIGNUP_FAIL);
            });
    }
}

export default UserService;
