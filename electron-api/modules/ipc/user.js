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
        this.password = null;
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
        ipcMain.on(this.serverEvent.signup, (event, arg) => {
            this._signUp(event, arg);
        });
    }

    getPassword () {
        return this.password;
    }

    setPassword (password) {
        this.password = password;
    }

    _signUp (event, arg) {
        UserService
            .getService('ipfs')
            .getIpfsService()
            .api
            .add(arg)
            .then((response) => {
                const ipfsHash = response[0].Hash;
                const web3 = UserService.getService('geth').getGethService().web3;
                web3.eth.getCoinbase((err, res) => {
                    if (err) {
                        this._sendEvent(event)(this.clientEvent.signUp, false, this.NO_COINBASE_FAIL);
                    } else {
                        web3.personal.unlockAccountAsync(res, this.password, 20000).then((data) => {
                            const registry = new dapples.class(gethInstance.web3).objects.registry;

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
