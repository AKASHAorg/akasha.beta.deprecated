import { addHexPrefix } from 'ethereumjs-util';
import * as Promise from 'bluebird';
import { AUTH_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

export const randomBytesAsync = Promise.promisify(window.crypto.getRandomValues);

export default function init(sp, getService) {
  class Auth {

    public regenSession(token: string) {
      return true;
    }

    public login(acc: string, timer: number = 30, registering = false) {
      const arr = new Uint32Array(32);
      return randomBytesAsync(arr)
        .then((buff: Buffer) => {
          const token = addHexPrefix(buff.toString('hex'));
          const expiration = new Date();
          (getService(CORE_MODULE.RESPONSES)).gethStatus.akashaKey = acc;
          expiration.setMinutes(expiration.getMinutes() + timer);
          (getService(CORE_MODULE.WEB3_API)).instance.eth.defaultAccount = acc;

          return { token, expiration, ethAddress: acc };
          // });
        });
    }

    public logout() {
      this._flushSession();
    }

    /**
     *
     * @param token
     * @returns {boolean}
     */
    public isLogged(token: any) {
      return Promise.resolve(true);
    }

    /**
     *
     * @param data
     * @param token
     * @returns {any}
     */
    public signData(data: {}, token: string) {
      return this.isLogged(token)
        .then(function (logged) {
          if (!logged) {
            throw new Error('Token is not valid!');
          }
          return (getService(CORE_MODULE.WEB3_API)).instance.eth.sendTransaction(data);
        });
    }

    public signMessage(data: {}, token: string) {
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

    /**
     *
     * @private
     */
    private _flushSession() {
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
