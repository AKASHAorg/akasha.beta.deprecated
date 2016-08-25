import { createCipher, createDecipher, randomBytes, Decipher, Cipher } from 'crypto';
import { GethConnector, gethHelper } from '@akashaproject/geth-connector';
import { fromRpcSig, ecrecover, toBuffer, bufferToHex, pubToAddress } from 'ethereumjs-util';
import * as Promise from 'bluebird';

const randomBytesAsync = Promise.promisify(randomBytes);
export default class Auth {
    private _encrypted: Buffer;
    private _decipher: Decipher;
    private _cipher: Cipher;
    private _session: {address: string, expiration: Date, vrs: {v: string, r: string, s: string}};

    /**
     *
     * @param pass
     * @returns {Bluebird<string>|PromiseLike<string>|Thenable<string>|Promise<string>}
     */
    generateKey(pass: any) {
        return this._encrypt(pass)
            .then(() => {
                return GethConnector.getInstance()
                    .web3
                    .personal
                    .newAccountAsync(this._read().toString('utf8'));
            })
            .then((address: string) => {
                this.login(address, pass, 2);
                return address;
            });
    }

    /**
     *
     * @returns {Promise<TResult>|Bluebird<U>|PromiseLike<TResult>|Thenable<U>}
     * @private
     */
    private _generateRandom() {
        return randomBytesAsync(256).then((buff: Buffer) => {
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
    private _read() {
        return Buffer.concat([this._decipher.update(this._encrypted), this._decipher.final()]);
    }

    /**
     *
     * @param acc
     * @param pass
     * @param timer
     * @returns {Bluebird<U>}
     */
    protected login(acc: string, pass: Uint8Array[], timer?: number) {

        return gethHelper
            .hasKey(acc)
            .then((found) => {
                if (!found) {
                    throw new Error(`local key for ${acc} not found`);
                }
                // temporary until personal_sign is shipped
                // follow here https://github.com/ethereum/go-ethereum/pull/2940
                // @TODO: migrate to personal_sign when available
                this._encrypt(pass)
                    .then(() => {
                        return GethConnector.getInstance()
                            .web3
                            .personal
                            .unlockAccountAsync(acc, this._read().toString('utf8'), 2000);
                    })
                    .then((unlocked: boolean) => {
                        if (!unlocked) {
                            throw new Error(`invalid password`);
                        }
                        return randomBytesAsync(256);
                    })
                    .then((buff: Buffer) => {
                            const token = GethConnector.getInstance()
                                .web3
                                .sha3(buff.toString('hex'), {encoding: 'hex'});
                            return this._signSession(acc, token)
                                .then((signedString: string) => {
                                    const expiration = new Date();
                                    expiration.setMinutes(expiration.getMinutes() + timer);
                                    this._session = {
                                        expiration,
                                        address: acc,
                                        vrs: fromRpcSig(signedString)
                                    };
                                    setTimeout(() => this._flushSession(), 1000 * 60 * timer);
                                    return {token, expiration};
                                });
                    })
                    .catch((err: Error) => {
                        return {error: err.message};
                    })
                    .finally(() => GethConnector.getInstance().web3.personal.lockAccountAsync(acc));
            });
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
        if (!this._session || !token) {
            return false;
        }

        if (now > this._session.expiration) {
            return false;
        }
        const {v, r, s} = this._session.vrs;
        try {
            pubKey = bufferToHex(ecrecover(toBuffer(token), v, r, s));
            ethAddr = pubToAddress(pubKey);
            return bufferToHex(ethAddr) === this._session.address;
        }catch (err) {
            return false;
        }

    }

    /**
     *
     * @private
     */
    private _flushSession() {
        this._session = null;
        this._encrypted = null;
    }

    /**
     *
     * @param account
     * @param hash
     * @returns {any}
     * @private
     */
    private _signSession(account: string, hash: string) {
        return GethConnector.getInstance()
            .web3
            .eth
            .signAsync(account, hash);
    }

    /**
     *
     * @param data
     * @param token
     * @returns {any}
     */
    public signData(data: {}, token: string) {
        if (this.isLogged(token)) {
            return GethConnector.getInstance()
                .web3
                .personal
                .unlockAccountAndSendTransactionAsync(data, this._read().toString('utf8'));
        }
        return Promise.reject(new Error('Authentication required'));
    }
}
