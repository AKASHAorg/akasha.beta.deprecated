import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Buffer } from 'safe-buffer';
// import { takeLast }from 'ramda';
import {
  addHexPrefix,
  bufferToHex,
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
  toBuffer,
} from 'ethereumjs-util';
import * as Promise from 'bluebird';
import { AUTH_MODULE, CORE_MODULE } from '@akashaproject/common/constants';

export const randomBytesAsync = Promise.promisify(randomBytes);

export default function init(sp, getService) {

  class Auth {
    private encrypted: any;
    private decipher: any;
    private cipher: any;
    private session:
      { address: string, expiration: Date, vrs: { v: string, r: string, s: string } };
    private task;

    public generateKey(pass: any) {
      try {
        if (!Buffer.isBuffer(pass)) {
          return Promise.reject(new Error('Incorrect password format'));
        }
        const transformed = Buffer.from(pass).toString('utf8');
        return (getService(CORE_MODULE.GETH_CONNECTOR)).getInstance()
          .web3
          .personal
          .newAccount(transformed)
          .then((address: string) => {
            return address;
          });
      } catch (err) {
        return Promise.reject(err);
      }

    }

    public login(acc: string, pass: any | Uint8Array, timer: number = 1) {

      return (getService(CORE_MODULE.WEB3_HELPER))
        .hasKey(acc)
        .then((found) => {
          if (!found) {
            throw new Error(`local key for ${acc} not found`);
          }
          return this.encrypt(pass);
        })
        .then(() => {
          return randomBytesAsync(64);
        })
        .then((buff) => {
          const token = addHexPrefix(buff.toString('hex'));
          return this.signSession(token, acc, Buffer.from(pass).toString('utf8'))
            .then((signedString: string) => {
              const expiration = new Date();
              const clientToken = hashPersonalMessage(buff);
              expiration.setMinutes(expiration.getMinutes() + timer);
              (getService(CORE_MODULE.GETH_CONNECTOR))
                .getInstance().web3.personal.lockAccount(acc).then(() => null);
              (getService(CORE_MODULE.GETH_CONNECTOR))
                .getInstance().web3.eth.defaultAccount = acc;
              this.session = {
                expiration,
                address: acc,
                vrs: fromRpcSig(signedString),
              };
              this.task = setTimeout(() => this.flushSession(), 1000 * 60 * timer);
              return {
                expiration,
                token: addHexPrefix(clientToken.toString('hex')),
                ethAddress: acc,
              };
            });
        });
    }

    public logout() {
      if (this.session) {
        (getService(CORE_MODULE.GETH_CONNECTOR))
          .getInstance().web3.personal.lockAccount(this.session.address);
      }
      this.flushSession();

    }

    public isLogged(token: any) {
      let pubKey: string;
      let ethAddr: Buffer;
      const now = new Date();
      // console.log(token);
      if (!this.session || !token) {
        return false;
      }

      if (now > this.session.expiration) {
        return false;
      }
      const { v, r, s } = this.session.vrs;
      try {
        pubKey = bufferToHex(ecrecover(toBuffer(token), v, r, s));
        ethAddr = pubToAddress(pubKey);
        // console.log(bufferToHex(ethAddr), this.session.address);
        return bufferToHex(ethAddr) === this.session.address;
      } catch (err) {
        return false;
      }

    }

    public signData(data: {}, token: string) {
      return (getService(CORE_MODULE.GETH_CONNECTOR)).getInstance()
        .web3
        .personal
        .sendTransaction(data, this.read(token).toString('utf8'));
    }

    public signMessage(data: {}, token: string) {
      return (getService(CORE_MODULE.GETH_CONNECTOR)).getInstance()
        .web3
        .personal
        .sign(
          data,
          (getService(CORE_MODULE.GETH_CONNECTOR)).getInstance().web3.eth.defaultAccount,
          this.read(token).toString('utf8'));
    }

    generateRandom() {
      return randomBytesAsync(16).then((buff) => {
        return randomBytesAsync(16).then((iv) => {
          const extraData = randomBytes(8);
          this.cipher = createCipheriv('aes-256-gcm', buff.toString('hex'), iv);
          this.decipher = createDecipheriv('aes-256-gcm', buff.toString('hex'), iv);

          this.cipher.setAAD(extraData);
          this.decipher.setAAD(extraData);
          return true;
        });
      });
    }

    encrypt(key: any) {
      const keyTr = Buffer.from(key);
      return this.generateRandom().then(() => {
        this.encrypted = Buffer.concat([this.cipher.update(keyTr), this.cipher.final()]);
        return true;
      });
    }

    read(token: any) {

      if (!this.isLogged(token)) {
        throw new Error('Token is not valid');
      }
      this.decipher.setAuthTag(this.cipher.getAuthTag());
      const result = Buffer.concat(
        [this.decipher.update(this.encrypted), this.decipher.final()]);
      this.encrypt(result);
      return result;
    }

    flushSession() {
      this.session = null;
      this.encrypted = null;
      this.cipher = null;
      this.decipher = null;
      clearTimeout(this.task);
      console.log('flushed session');
    }

    signSession(hash: string, account: string, password: string) {
      return (getService(CORE_MODULE.GETH_CONNECTOR)).getInstance()
        .web3
        .personal
        .sign(hash, account, password);
    }
  }

  const auth = new Auth();
  const service = function () {
    return auth;
  };
  sp().service(AUTH_MODULE.auth, service);
}
