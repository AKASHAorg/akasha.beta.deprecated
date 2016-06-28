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
        this.UNLOCK_INTERVAL = 2000;
        this.ZERO_ADDR = '0x0000000000000000000000000000000000000000';
        this.UNLOCK_COINBASE_FAIL = 'unlock account fail, check your password';
    }

    _chopIpfsHash (hash) {
        const delimiter = Math.floor(hash.length / 2);
        return [hash.substring(0, delimiter), hash.substring(delimiter)];
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
    // this already returns a promise created at _addToIpfs() method above
    _uploadImage (name, buffer) {
        console.log(new Buffer(buffer));
        return this._addToIpfs({
            data: buffer,
            options: {
                isPath: true
            }
        }).then(response => {
            return { name,
                hash: response[0].Hash
            };
        // better to catch these errors later when you use _uploadImage
        }).catch((err) => console.error(err));
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
