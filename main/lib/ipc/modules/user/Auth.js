"use strict";
const crypto_1 = require('crypto');
const geth_connector_1 = require('@akashaproject/geth-connector');
const ethereumjs_util_1 = require('ethereumjs-util');
const winston_1 = require('winston');
class Auth {
    constructor() {
        this._generateRandom();
    }
    generateKey(pass) {
        this._encrypt(pass);
        let transformed = geth_connector_1.GethConnector.getInstance()
            .web3
            .fromUtf8(this._read().toString('utf8'));
        return geth_connector_1.GethConnector.getInstance()
            .web3
            .personal
            .newAccountAsync(transformed)
            .then((address) => {
            transformed = null;
            return address;
        });
    }
    _generateRandom() {
        crypto_1.randomBytes(256, (err, buff) => {
            if (err) {
                throw err;
            }
            this._cipher = crypto_1.createCipher('aes-256-cbc', buff.toString('hex'));
            this._decipher = crypto_1.createDecipher('aes-256-cbc', buff.toString('hex'));
        });
    }
    _encrypt(key) {
        const keyTr = Buffer.from(key);
        this._encrypted = Buffer.concat([this._cipher.update(keyTr), this._cipher.final()]);
        return this;
    }
    _read() {
        return Buffer.concat([this._decipher.update(this._encrypted), this._decipher.final()]);
    }
    login(acc, pass, timer) {
        if (!ethereumjs_util_1.isValidAddress(acc)) {
            throw new Error(`${acc} is an invalid address`);
        }
        return geth_connector_1.gethHelper
            .hasKey(acc)
            .then((found) => {
            if (!found) {
                throw new Error(`local key for ${acc} not found`);
            }
            this._encrypt(pass);
            geth_connector_1.GethConnector.getInstance()
                .web3
                .personal
                .unlockAccountAsync(acc, this._read().toString('utf8'), 500)
                .then((unlocked) => {
                if (!unlocked) {
                    throw new Error(`invalid password`);
                }
                crypto_1.randomBytes(256, (err, buff) => {
                    if (err) {
                        throw err;
                    }
                    this._token = buff.toString('hex');
                    this._signSession(this._token)
                        .then((signedString) => {
                        const expiration = new Date();
                        expiration.setMinutes(expiration.getMinutes() + timer);
                        this._session = {
                            signedToken: signedString,
                            expiration: expiration,
                            address: acc,
                            vrs: ethereumjs_util_1.fromRpcSig(signedString)
                        };
                        setTimeout(() => this._flushSession(), 1000 * 60 * timer);
                    });
                });
            })
                .catch((err) => winston_1.Logger)
                .finally(() => geth_connector_1.GethConnector.getInstance().web3.personal.lockAccountAsync(acc));
        });
    }
    isLogged() {
        const now = new Date();
        if (!this._session) {
            return false;
        }
        if (now > this._session.expiration) {
            return false;
        }
        const { v, r, s } = this._session.vrs;
        return ethereumjs_util_1.ecrecover(this._token, v, r, s) === this._session.address;
    }
    _flushSession() {
        this._session = null;
        this._token = null;
        this._encrypted = null;
    }
    _signSession(hash) {
        return geth_connector_1.GethConnector.getInstance()
            .web3
            .eth
            .signAsync(hash);
    }
    signData(data) {
        if (this.isLogged()) {
            return geth_connector_1.GethConnector.getInstance()
                .web3
                .personal
                .unlockAccountAndSendTransactionAsync(data, this._read().toString('utf8'));
        }
        return Promise.reject(new Error('Authentication required'));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Auth;
//# sourceMappingURL=Auth.js.map