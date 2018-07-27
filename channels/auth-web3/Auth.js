"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.randomBytesAsync = Promise.promisify(window.crypto.getRandomValues);
function init(sp, getService) {
    class Auth {
        regenSession(token) {
            return true;
        }
        login(acc, timer = 30, registering = false) {
            const arr = new Uint32Array(32);
            return exports.randomBytesAsync(arr)
                .then((buff) => {
                const token = ethereumjs_util_1.addHexPrefix(buff.toString('hex'));
                const expiration = new Date();
                getService(constants_1.CORE_MODULE.RESPONSES).gethStatus.akashaKey = acc;
                expiration.setMinutes(expiration.getMinutes() + timer);
                getService(constants_1.CORE_MODULE.WEB3_API).instance.eth.defaultAccount = acc;
                return { token, expiration, ethAddress: acc };
            });
        }
        logout() {
            this._flushSession();
        }
        isLogged(token) {
            return Promise.resolve(true);
        }
        signData(data, token) {
            return this.isLogged(token)
                .then(function (logged) {
                if (!logged) {
                    throw new Error('Token is not valid!');
                }
                return getService(constants_1.CORE_MODULE.WEB3_API).instance.eth.sendTransactionAsync(data);
            });
        }
        signMessage(data, token) {
            const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
            return this.isLogged(token)
                .then(function (logged) {
                if (!logged) {
                    throw new Error('Token is not valid!');
                }
                return web3Api.instance
                    .personal
                    .signAsync(data, web3Api.instance.eth.defaultAccount);
            });
        }
        _flushSession() {
            getService(constants_1.CORE_MODULE.RESPONSES).gethStatus.akashaKey = '';
            getService(constants_1.CORE_MODULE.RESPONSES).gethStatus.shouldLogout = false;
            console.log('flushed session');
        }
    }
    const auth = new Auth();
    const service = function () {
        return auth;
    };
    sp().service(constants_1.AUTH_MODULE.auth, service);
}
exports.default = init;
//# sourceMappingURL=Auth.js.map