import { Cipher, createCipher, createDecipher, Decipher, randomBytes } from 'crypto';
import { GethConnector, gethHelper } from '@akashaproject/geth-connector';
import {
    addHexPrefix,
    bufferToHex,
    ecrecover,
    fromRpcSig,
    hashPersonalMessage,
    pubToAddress,
    toBuffer
} from 'ethereumjs-util';
import * as Promise from 'bluebird';

export const randomBytesAsync = Promise.promisify(randomBytes);

export class Auth {
    private _encrypted: Buffer;
    private _decipher: Decipher;
    private _cipher: Cipher;
    private _session: { address: string, expiration: Date, vrs: { v: string, r: string, s: string } };
    private _task;

    /**
     *
     * @param pass
     * @returns {Bluebird<string>|PromiseLike<string>|Thenable<string>|Promise<string>}
     */
    public generateKey(pass: any) {
        try {
            if (!Buffer.isBuffer(pass)) {
                return Promise.reject(new Error('Incorrect password format'));
            }
            const transformed = Buffer.from(pass).toString('utf8');
            return GethConnector.getInstance()
                .web3
                .personal
                .newAccountAsync(transformed)
                .then((address: string) => {
                    return address;
                });
        } catch (err) {
            return Promise.reject(err);
        }

    }

    /**
     *
     * @param acc
     * @param pass
     * @param timer
     * @param registering
     * @returns {any}
     */
    public login(acc: string, pass: any | Uint8Array, timer: number = 1, registering = false) {

        return gethHelper
            .hasKey(acc)
            .then((found) => {
                if (!found) {
                    throw new Error(`local key for ${acc} not found`);
                }
                // temporary until personal_sign is shipped
                // follow here https://github.com/ethereum/go-ethereum/pull/2940
                // @TODO: migrate to personal_sign when available
                return this._encrypt(pass);
            })
            .then(() => {
                return randomBytesAsync(64);
            })
            .then((buff: Buffer) => {
                const token = addHexPrefix(buff.toString('hex'));
                return this._signSession(token, acc, Buffer.from(pass).toString('utf8'))
                    .then((signedString: string) => {
                        const expiration = new Date();
                        const clientToken = hashPersonalMessage(buff);
                        expiration.setMinutes(expiration.getMinutes() + timer);
                        GethConnector.getInstance().web3.personal.lockAccountAsync(acc).then(() => null);
                        GethConnector.getInstance().web3.eth.defaultAccount = acc;
                        this._session = {
                            expiration,
                            address: acc,
                            vrs: fromRpcSig(signedString)
                        };
                        this._task = setTimeout(() => this._flushSession(), 1000 * 60 * timer);
                        return { token: addHexPrefix(clientToken.toString('hex')), expiration, account: acc };
                    });
            });
    }

    public logout() {
        if (this._session) {
            GethConnector.getInstance().web3.personal.lockAccountAsync(this._session.address);
        }
        this._flushSession();

    }

    /**
     *
     * @param token
     * @returns {boolean}
     */
    public isLogged(token: any) {
        let pubKey: string;
        let ethAddr: Buffer;
        const now = new Date();
        // console.log(token);
        if (!this._session || !token) {
            return false;
        }

        if (now > this._session.expiration) {
            return false;
        }
        const { v, r, s } = this._session.vrs;
        try {
            pubKey = bufferToHex(ecrecover(toBuffer(token), v, r, s));
            ethAddr = pubToAddress(pubKey);
            // console.log(bufferToHex(ethAddr), this._session.address);
            return bufferToHex(ethAddr) === this._session.address;
        } catch (err) {
            return false;
        }

    }

    /**
     *
     * @param data
     * @param token
     * @returns {any}
     */
    public signData(data: {}, token: string) {
        return GethConnector.getInstance()
            .web3
            .personal
            .sendTransactionAsync(data, this._read(token).toString('utf8'));
    }

    /**
     *
     * @returns {PromiseLike<boolean>|Promise<boolean>|Thenable<boolean>|Bluebird<boolean>}
     * @private
     */
    private _generateRandom() {
        return randomBytesAsync(64).then((buff: Buffer) => {
            this._cipher = createCipher('aes-256-ctr', buff.toString('hex'));
            this._decipher = createDecipher('aes-256-ctr', buff.toString('hex'));
            return true;
        });
    }

    /**
     *
     * @param key
     * @returns {Auth}
     * @private
     */
    private _encrypt(key: any) {
        const keyTr = Buffer.from(key);
        return this._generateRandom().then(() => {
            this._encrypted = Buffer.concat([this._cipher.update(keyTr), this._cipher.final()]);
            return true;
        });
    }

    /**
     *
     * @returns {Buffer}
     * @private
     */
    private _read(token: any) {

        if (!this.isLogged(token)) {
            throw new Error('Token is not valid');
        }
        const result = Buffer.concat([this._decipher.update(this._encrypted), this._decipher.final()]);
        this._encrypt(result);
        return result;
    }

    /**
     *
     * @private
     */
    private _flushSession() {
        this._session = null;
        this._encrypted = null;
        this._cipher = null;
        this._decipher = null;
        clearTimeout(this._task);
        console.log('flushed session');
    }

    /**
     *
     * @param hash
     * @param account
     * @param password
     * @returns {any}
     * @private
     */
    private _signSession(hash: string, account: string, password: string) {
        return GethConnector.getInstance()
            .web3
            .personal
            .signAsync(hash, account, password);
    }
}

export default new Auth();
