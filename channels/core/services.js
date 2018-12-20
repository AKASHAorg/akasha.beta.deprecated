"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@akashaproject/common/constants");
function init(sp) {
    class Service {
        get instance() {
            if (!this.serviceInstance) {
                throw new Error('No instance available');
            }
            return this.serviceInstance;
        }
        set instance(apiInstance) {
            this.serviceInstance = apiInstance;
        }
    }
    const web3Api = new Service();
    const ipfsApi = new Service();
    const ipfsProvider = new Service();
    const serviceW = function () {
        return web3Api;
    };
    const serviceIA = function () {
        return ipfsApi;
    };
    const serviceIP = function () {
        return ipfsProvider;
    };
    sp().service(constants_1.CORE_MODULE.WEB3_API, serviceW);
    sp().service(constants_1.CORE_MODULE.IPFS_API, serviceIA);
    sp().service(constants_1.CORE_MODULE.IPFS_PROVIDER, serviceIP);
}
exports.default = init;
//# sourceMappingURL=services.js.map