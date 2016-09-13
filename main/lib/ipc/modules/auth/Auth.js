"use strict";
const crypto_1 = require('crypto');
const geth_connector_1 = require('@akashaproject/geth-connector');
const ethereumjs_util_1 = require('ethereumjs-util');
const Promise = require('bluebird');
const randomBytesAsync = Promise.promisify(crypto_1.randomBytes);
class Auth {
    generateKey(pass) {
        try {
            const transformed = Buffer.from(pass).toString('utf8');
            return geth_connector_1.GethConnector.getInstance()
                .web3
                .personal
                .newAccountAsync(transformed)
                .then((address) => {
                return address;
            });
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    _generateRandom() {
        return randomBytesAsync(64).then((buff) => {
            this._cipher = crypto_1.createCipher('aes-256-ctr', buff.toString('hex'));
            this._decipher = crypto_1.createDecipher('aes-256-ctr', buff.toString('hex'));
            return true;
        });
    }
    _encrypt(key) {
        const keyTr = Buffer.from(key);
        return this._generateRandom().then(() => {
            this._encrypted = Buffer.concat([this._cipher.update(keyTr), this._cipher.final()]);
            return true;
        });
    }
    _read(token) {
        if (!this.isLogged(token)) {
            throw new Error('Token is not valid');
        }
        const result = Buffer.concat([this._decipher.update(this._encrypted), this._decipher.final()]);
        this._encrypt(result);
        return result;
    }
    login(acc, pass, timer = 0) {
        return geth_connector_1.gethHelper
            .hasKey(acc)
            .then((found) => {
            if (!found) {
                throw new Error(`local key for ${acc} not found`);
            }
            return this._encrypt(pass);
        })
            .then(() => {
            return geth_connector_1.GethConnector.getInstance()
                .web3
                .personal
                .unlockAccountAsync(acc, Buffer.from(pass).toString('utf8'), 1000);
        })
            .then((unlocked) => {
            if (!unlocked) {
                throw new Error(`invalid password`);
            }
            return randomBytesAsync(64);
        })
            .then((buff) => {
            const token = geth_connector_1.GethConnector.getInstance()
                .web3
                .sha3(buff.toString('hex'), { encoding: 'hex' });
            return this._signSession(acc, token)
                .then((signedString) => {
                const expiration = new Date();
                expiration.setMinutes(expiration.getMinutes() + timer);
                geth_connector_1.GethConnector.getInstance().web3.personal.lockAccountAsync(acc);
                geth_connector_1.GethConnector.getInstance().web3.eth.defaultAccount = acc;
                this._session = {
                    expiration: expiration,
                    address: acc,
                    vrs: ethereumjs_util_1.fromRpcSig(signedString)
                };
                setTimeout(() => this._flushSession(), 1000 * 60 * timer);
                return { token: token, expiration: expiration };
            });
        })
            .catch((err) => {
            geth_connector_1.GethConnector.getInstance().web3.personal.lockAccountAsync(acc);
            return { error: { message: err.message } };
        });
    }
    logout() {
        if (this._session) {
            geth_connector_1.GethConnector.getInstance().web3.eth.defaultAccount = '';
            geth_connector_1.GethConnector.getInstance().web3.personal.lockAccountAsync(this._session.address);
        }
        this._flushSession();
    }
    isLogged(token) {
        let pubKey;
        let ethAddr;
        const now = new Date();
        if (!this._session || !token) {
            return false;
        }
        if (now > this._session.expiration) {
            return false;
        }
        const { v, r, s } = this._session.vrs;
        try {
            pubKey = ethereumjs_util_1.bufferToHex(ethereumjs_util_1.ecrecover(ethereumjs_util_1.toBuffer(token), v, r, s));
            ethAddr = ethereumjs_util_1.pubToAddress(pubKey);
            return ethereumjs_util_1.bufferToHex(ethAddr) === this._session.address;
        }
        catch (err) {
            return false;
        }
    }
    _flushSession() {
        this._session = null;
        this._encrypted = null;
        this._cipher = null;
        this._decipher = null;
    }
    _signSession(account, hash) {
        return geth_connector_1.GethConnector.getInstance()
            .web3
            .eth
            .signAsync(account, hash);
    }
    signData(data, token) {
        return geth_connector_1.GethConnector.getInstance()
            .web3
            .personal
            .unlockAccountAndSendTransactionAsync(data, this._read(token).toString('utf8'));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Auth;
//# sourceMappingURL=Auth.js.map