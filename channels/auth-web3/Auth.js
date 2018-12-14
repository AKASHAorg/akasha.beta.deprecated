import { addHexPrefix } from 'ethereumjs-util';
import * as Promise from 'bluebird';
import { AUTH_MODULE, CORE_MODULE } from '@akashaproject/common/constants';
export const randomBytesAsync = Promise.promisify(window.crypto.getRandomValues);
export default function init(sp, getService) {
    class Auth {
        regenSession(token) {
            return true;
        }
        login(acc, timer = 30, registering = false) {
            const arr = new Uint32Array(32);
            return randomBytesAsync(arr)
                .then((buff) => {
                const token = addHexPrefix(buff.toString('hex'));
                const expiration = new Date();
                (getService(CORE_MODULE.RESPONSES)).gethStatus.akashaKey = acc;
                expiration.setMinutes(expiration.getMinutes() + timer);
                (getService(CORE_MODULE.WEB3_API)).instance.eth.defaultAccount = acc;
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
                return (getService(CORE_MODULE.WEB3_API)).instance.eth.sendTransaction(data);
            });
        }
        signMessage(data, token) {
            const web3Api = getService(CORE_MODULE.WEB3_API);
            return this.isLogged(token)
                .then(function (logged) {
                if (!logged) {
                    throw new Error('Token is not valid!');
                }
                return web3Api.instance
                    .personal
                    .sign(data, web3Api.instance.eth.defaultAccount);
            });
        }
        _flushSession() {
            (getService(CORE_MODULE.RESPONSES)).gethStatus.akashaKey = '';
            (getService(CORE_MODULE.RESPONSES)).gethStatus.shouldLogout = false;
            console.log('flushed session');
        }
    }
    const auth = new Auth();
    const service = function () {
        return auth;
    };
    sp().service(AUTH_MODULE.auth, service);
}
//# sourceMappingURL=Auth.js.map