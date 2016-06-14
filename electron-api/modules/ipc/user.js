const { ipcMain } = require('electron');
const IpcService = require('./ipcService');
const dapples = require('../../../contracts.sol/build/js_module.js');

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
        const registry = new dapples.class(web3).objects.registry;
        registry.hasProfile.call(web3.fromUtf8(arg.username), {

        }, function(err, res){
            console.log(res);
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
                console.log('ipfs hash: '+ipfsHash);
                const geth = UserService.getService('geth').getGethService();
                const web3 = geth.web3;
                web3.eth.getCoinbase((err, res) => {
                    console.log('account: ' + res);
                    if (err) {
                        this._sendEvent(event)(this.clientEvent.signUp, false, this.NO_COINBASE_FAIL);
                    } else {
                        web3.personal.unlockAccountAsync(res, this.password, 20000).then(() => {
                            console.log('unlock went through');
                            const registry = new dapples.class(web3).objects.registry;
                            const ipfsHashDelimiter = Math.floor(ipfsHash.length / 2);
                            registry.register(web3.fromUtf8(JSON.parse(arg.data).username), [ipfsHash.substring(0, ipfsHashDelimiter), ipfsHash.substring(ipfsHashDelimiter)], {
                                    gas: 1900000
                                }, (err, tx) => {
                                console.log('transaction went through: ' + tx);
                                UserService.getService('geth').addFilter('tx', tx, (txInfo) => {
                                    this._sendEvent(event)(this.clientEvent.signUp, true, txInfo);
                                });
                            });
                        });
                    }
                });
            })
            .catch(() => {
                this._sendEvent(event)(this.clientEvent.signUp, false, this.IPFS_ADD_SIGNUP_FAIL);
            });
    }
}

export default UserService;
