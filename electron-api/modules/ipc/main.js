const IpcService = require('./ipcService');
const Promise = require('bluebird');

/**
 * MainService class
 * It provides UserService, EntryService with util methods
 * for accessing ipfs and geth services
 */
class MainService extends IpcService {
    /*
     * @returns {EntryService}
     */
    constructor (type) {
        super(type);
    }

    _getIpfsAPI () {
        return MainService
                .getService('ipfs')
                .getIpfsService()
                .api;
    }

    _addToIpfs (data) {
        return new Promise((resolve, reject) => {
            this
                ._getIpfsAPI()
                .add(data)
                .then((response) => resolve(response))
                .catch((err) => reject(err));
        });
    }

    _uploadImage (name, buffer) {
        return new Promise((resolve, reject) => {
            this._addToIpfs({
                data: buffer,
                options: {
                    isPath: true
                }
            }).then((response) => resolve({ name,
                    hash: response[0].Hash
                })
            ).catch((err) => reject(err));
        });
    }

    __getGeth () {
        return MainService.getService('geth');
    }

    __getWeb3 () {
        return this
                .__getGeth()
                .getGethService()
                .web3;
    }
}

export default MainService;
