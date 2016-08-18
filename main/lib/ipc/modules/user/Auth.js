"use strict";
const crypto_1 = require('crypto');
const geth_connector_1 = require('@akashaproject/geth-connector');
class Auth {
    constructor() {
        this._generateRandom();
    }
    generateKey() {
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
    encrypt(key) {
        const keyTr = Buffer.from(key);
        this._encrypted = Buffer.concat([this._cipher.update(keyTr), this._cipher.final()]);
    }
    _read() {
        return Buffer.concat([this._decipher.update(this._encrypted), this._decipher.final()]);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Auth;
//# sourceMappingURL=Auth.js.map