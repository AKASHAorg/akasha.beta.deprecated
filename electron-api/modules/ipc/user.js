const { ipcMain } = require('electron');
const IpcService = require('./ipcService');
const Dapple = require('../../../contracts.sol/build/js_module.js');
const request = require('request');
const Promise = require('bluebird');

/**
 * UserService class
 * It provides the Renderer with access to User instance.
 * It also registers events for the Renderer.
 *
 */
class UserService extends IpcService {
    /*
     * @returns {UserService}
     */
    constructor () {
        super('user');
        this.IPFS_ADD_SIGNUP_FAIL = 'ipfs add user signup fail';
        this.NO_COINBASE_FAIL = 'no coinbase / no ethereum account';
        this.password = 'zz';
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
            this._signUp(event, {
                data: JSON.stringify(arg)
            });
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
            this._registerProfile(event, arg);
        });
        ipcMain.on(this.serverEvent.listAccounts, (event, arg) => {
            this._listAccounts(event, arg);
        });
    }

    getPassword () {
        return this.password;
    }

    setPassword (password) {
        this.password = password;
    }

    _usernameExists (event, arg) {
        const geth = UserService.getService('geth').getGethService();
        const web3 = geth.web3;
        const registry = new Dapple.class(web3).objects.registry;
        registry.hasProfile.call(web3.fromUtf8(arg.username), {

        }, (err, res) => {
            if (!err) {
                this._sendEvent(event)(this.clientEvent.createCoinbase, true, res);
            }
        });
    }

    _createCoinbase (event, arg) {
        const web3 = this.__getWeb3();
        web3.personal.newAccountAsync(arg.password).then((data) => {
            this._sendEvent(event)(this.clientEvent.createCoinbase, true, data);
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
                profilePromises
                .push(getByAddrPromise(ethAccount)
                .then((profileContractAddress) => profileContractAddress));
            }

            Promise.all(profilePromises).then((results) => {
                for (let i = 0; i < results.length; i++) {
                    const akashaProfileContractHash = results[i];
                    if (akashaProfileContractHash !== '0x0000000000000000000000000000000000000000') {
                        profile.at(akashaProfileContractHash).getIpfs.call((err, tuple) => {
                            // console.log(web3.toUtf8(tuple[0]) + web3.toUtf8(tuple[1]));
                            // TODO: get the ipfsHash and get user info
                        });
                    }
                }
            });
            this._sendEvent(event)(this.clientEvent.listAccounts, true, data);
        });
    }

    _faucetEther (event, arg) {
        const URL = 'http://faucet.ma.cx:3000/donate/' + arg.account; // eslint-disable-line prefer-template
        request({
            uri: URL,
            method: 'GET',
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 4
        }, (error, response, body) => {
            UserService
                .getService('geth')
                .addFilter('tx', body.txhash, (txInfo) => {
                    this.
                        _sendEvent(event)(this.clientEvent.faucetEther, true, txInfo);
                });
        });
    }

    _signUp (event, arg) {
        UserService
            .getService('ipfs')
            .getIpfsService()
            .api
            .add(arg)
            .then((response) => {
                const ipfsHash = response[0].Hash;
                const web3 = this.__getWeb3();
                web3.eth.getCoinbase((err, res) => {
                    if (err) {
                        this.
                            _sendEvent(event)(
                                    this.clientEvent.signUp,
                                    false,
                                    this.NO_COINBASE_FAIL);
                    } else {
                        web3.personal.unlockAccountAsync(res, this.password, 20000).then(() => {
                            const registry = new Dapple.class(web3).objects.registry;
                            const ipfsHashDelimiter = Math.floor(ipfsHash.length / 2);
                            registry.register(
                                web3.fromUtf8(JSON.parse(arg.data).username),
                                [
                                    ipfsHash.substring(0, ipfsHashDelimiter),
                                    ipfsHash.substring(ipfsHashDelimiter)
                                ],
                                {
                                    gas: 1900000
                                }, (error, tx) => {
                                    if (!error) {
                                        UserService
                                            .getService('geth')
                                            .addFilter('tx', tx, (txInfo) => {
                                                this.
                                                    _sendEvent(event)(this.clientEvent.signUp,
                                                                        true,
                                                                        txInfo);
                                            });
                                    }
                                });
                        });
                    }
                });
            })
            .catch(() => {
                this._sendEvent(event)(this.clientEvent.signUp, false, this.IPFS_ADD_SIGNUP_FAIL);
            });
    }

    _registerProfile (event, arg) {
        UserService
            .getService('ipfs')
            .getIpfsService()
            .api
            .add(arg)
            .then((response) => {
                const ipfsHash = response[0].Hash;
                const web3 = this.__getWeb3();
                web3.personal.unlockAccountAsync(arg.account, arg.password, 300).then(() => {
                    const registry = new Dapple.class(web3).objects.registry;
                    const ipfsHashDelimiter = Math.floor(ipfsHash.length / 2);
                    registry.register(
                        web3.fromUtf8(JSON.parse(arg.data).username),
                        [
                            ipfsHash.substring(0, ipfsHashDelimiter),
                            ipfsHash.substring(ipfsHashDelimiter)
                        ],
                        {
                            gas: 1900000
                        }, (err, tx) => {
                            this._sendEvent(event)(
                                this.clientEvent.registryRegisterHash,
                                true,
                                tx); // o sa ii pasez si currentblock
                            UserService.getService('geth').addFilter('tx', tx, (txInfo) => {
                                this._sendEvent(event)(
                                    this.clientEvent.registryRegisterComplete,
                                    true,
                                    txInfo);
                            });
                        });
                });
            })
            .catch(() => {
                this._sendEvent(event)(this.clientEvent.signUp, false, this.IPFS_ADD_SIGNUP_FAIL);
            });
    }

    __getWeb3 () {
        return UserService
                .getService('geth')
                .getGethService()
                .web3;
    }
}

export default UserService;
