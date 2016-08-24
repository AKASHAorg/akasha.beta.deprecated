import { createCipher, createDecipher, randomBytes, Decipher, Cipher } from 'crypto';
import { GethConnector, gethHelper } from '@akashaproject/geth-connector';
import { fromRpcSig, ecrecover, isValidAddress } from 'ethereumjs-util';
import { Logger } from 'winston';

export default class Auth {
    private _encrypted: Buffer;
    private _decipher: Decipher;
    private _cipher: Cipher;
    private _session: {signedToken: string, address: string, expiration: Date, vrs: {v: string, r: string, s: string}};
    private _token: string;

    constructor() {
        this._generateRandom();
    }

    /**
     *
     * @param pass
     * @returns {Bluebird<string>|PromiseLike<string>|Thenable<string>|Promise<string>}
     */
    generateKey(pass: any) {
        this._encrypt(pass);
        let transformed = GethConnector.getInstance()
            .web3
            .fromUtf8(this._read().toString('utf8'));
        return GethConnector.getInstance()
            .web3
            .personal
            .newAccountAsync(transformed)
            .then((address: string) => {
                transformed = null;
                return address;
            });
    }

    /**
     *
     * @private
     */
    private _generateRandom() {
        randomBytes(256, (err, buff) => {
            if (err) {
                throw err;
            }
            this._cipher = createCipher('aes-256-cbc', buff.toString('hex'));
            this._decipher = createDecipher('aes-256-cbc', buff.toString('hex'));
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
        this._encrypted = Buffer.concat([this._cipher.update(keyTr), this._cipher.final()]);
        return this;
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
     * @param timer                                  number of minutes
     * @returns {Bluebird<U>}
     */
    protected login(acc: string, pass: Uint8Array[], timer?: number) {
        if (!isValidAddress(acc)) {
            throw new Error(`${acc} is an invalid address`);
        }
        return gethHelper
            .hasKey(acc)
            .then((found) => {
                if (!found) {
                    throw new Error(`local key for ${acc} not found`);
                }
                this._encrypt(pass);
                // temporary until personal_sign is shipped
                // follow here https://github.com/ethereum/go-ethereum/pull/2940
                // @TODO: migrate to personal_sign when available
                GethConnector.getInstance()
                    .web3
                    .personal
                    .unlockAccountAsync(acc, this._read().toString('utf8'), 500)
                    .then((unlocked: boolean) => {
                        if (!unlocked) {
                            throw new Error(`invalid password`);
                        }
                        randomBytes(256, (err, buff) => {
                            if (err) {
                                throw err;
                            }
                            this._token = buff.toString('hex');
                            this._signSession(this._token)
                                .then((signedString: string) => {
                                    const expiration = new Date();
                                    expiration.setMinutes(expiration.getMinutes() + timer);
                                    this._session = {
                                        signedToken: signedString,
                                        expiration,
                                        address: acc,
                                        vrs: fromRpcSig(signedString)
                                    };
                                    setTimeout(() => this._flushSession(), 1000 * 60 * timer);
                                });
                        });
                    })
                    .catch((err: any) => Logger)
                    .finally(() => GethConnector.getInstance().web3.personal.lockAccountAsync(acc));
            });
    }

    /**
     *
     * @returns {boolean}
     */
    public isLogged() {
        const now = new Date();
        if (!this._session) {
            return false;
        }

        if (now > this._session.expiration) {
            return false;
        }
        const {v, r, s} = this._session.vrs;
        return ecrecover(this._token, v, r, s) === this._session.address;
    }

    /**
     *
     * @private
     */
    private _flushSession() {
        this._session = null;
        this._token = null;
        this._encrypted = null;
    }

    // temporary
    private _signSession(hash: string) {
        return GethConnector.getInstance()
            .web3
            .eth
            .signAsync(hash);
    }

    /**
     *
     * @param data
     * @returns {Promise}
     */
    public signData(data: {}) {
        if (this.isLogged()) {
            return GethConnector.getInstance()
                .web3
                .personal
                .unlockAccountAndSendTransactionAsync(data, this._read().toString('utf8'));
        }
        return Promise.reject(new Error('Authentication required'));
    }
}
