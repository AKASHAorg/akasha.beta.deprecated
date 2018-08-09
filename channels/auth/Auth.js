"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const safe_buffer_1 = require("safe-buffer");
const ethereumjs_util_1 = require("ethereumjs-util");
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
exports.randomBytesAsync = Promise.promisify(crypto_1.randomBytes);
function init(sp, getService) {
    class Auth {
        generateKey(pass) {
            try {
                if (!safe_buffer_1.Buffer.isBuffer(pass)) {
                    return Promise.reject(new Error('Incorrect password format'));
                }
                const transformed = safe_buffer_1.Buffer.from(pass).toString('utf8');
                return getService(constants_1.CORE_MODULE.GETH_CONNECTOR).getInstance()
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
        login(acc, pass, timer = 1) {
            return getService(constants_1.CORE_MODULE.WEB3_HELPER)
                .hasKey(acc)
                .then((found) => {
                if (!found) {
                    throw new Error(`local key for ${acc} not found`);
                }
                return this.encrypt(pass);
            })
                .then(() => {
                return exports.randomBytesAsync(64);
            })
                .then((buff) => {
                const token = ethereumjs_util_1.addHexPrefix(buff.toString('hex'));
                return this.signSession(token, acc, safe_buffer_1.Buffer.from(pass).toString('utf8'))
                    .then((signedString) => {
                    const expiration = new Date();
                    const clientToken = ethereumjs_util_1.hashPersonalMessage(buff);
                    expiration.setMinutes(expiration.getMinutes() + timer);
                    getService(constants_1.CORE_MODULE.GETH_CONNECTOR)
                        .getInstance().web3.personal.lockAccountAsync(acc).then(() => null);
                    getService(constants_1.CORE_MODULE.GETH_CONNECTOR)
                        .getInstance().web3.eth.defaultAccount = acc;
                    this.session = {
                        expiration,
                        address: acc,
                        vrs: ethereumjs_util_1.fromRpcSig(signedString),
                    };
                    this.task = setTimeout(() => this.flushSession(), 1000 * 60 * timer);
                    return {
                        expiration,
                        token: ethereumjs_util_1.addHexPrefix(clientToken.toString('hex')),
                        ethAddress: acc,
                    };
                });
            });
        }
        logout() {
            if (this.session) {
                getService(constants_1.CORE_MODULE.GETH_CONNECTOR)
                    .getInstance().web3.personal.lockAccountAsync(this.session.address);
            }
            this.flushSession();
        }
        isLogged(token) {
            let pubKey;
            let ethAddr;
            const now = new Date();
            if (!this.session || !token) {
                return false;
            }
            if (now > this.session.expiration) {
                return false;
            }
            const { v, r, s } = this.session.vrs;
            try {
                pubKey = ethereumjs_util_1.bufferToHex(ethereumjs_util_1.ecrecover(ethereumjs_util_1.toBuffer(token), v, r, s));
                ethAddr = ethereumjs_util_1.pubToAddress(pubKey);
                return ethereumjs_util_1.bufferToHex(ethAddr) === this.session.address;
            }
            catch (err) {
                return false;
            }
        }
        signData(data, token) {
            return getService(constants_1.CORE_MODULE.GETH_CONNECTOR).getInstance()
                .web3
                .personal
                .sendTransactionAsync(data, this.read(token).toString('utf8'));
        }
        signMessage(data, token) {
            return getService(constants_1.CORE_MODULE.GETH_CONNECTOR).getInstance()
                .web3
                .personal
                .signAsync(data, getService(constants_1.CORE_MODULE.GETH_CONNECTOR).getInstance().web3.eth.defaultAccount, this.read(token).toString('utf8'));
        }
        generateRandom() {
            return exports.randomBytesAsync(16).then((buff) => {
                return exports.randomBytesAsync(16).then((iv) => {
                    const extraData = crypto_1.randomBytes(8);
                    this.cipher = crypto_1.createCipheriv('aes-256-gcm', buff.toString('hex'), iv);
                    this.decipher = crypto_1.createDecipheriv('aes-256-gcm', buff.toString('hex'), iv);
                    this.cipher.setAAD(extraData);
                    this.decipher.setAAD(extraData);
                    return true;
                });
            });
        }
        encrypt(key) {
            const keyTr = safe_buffer_1.Buffer.from(key);
            return this.generateRandom().then(() => {
                this.encrypted = safe_buffer_1.Buffer.concat([this.cipher.update(keyTr), this.cipher.final()]);
                return true;
            });
        }
        read(token) {
            if (!this.isLogged(token)) {
                throw new Error('Token is not valid');
            }
            this.decipher.setAuthTag(this.cipher.getAuthTag());
            const result = safe_buffer_1.Buffer.concat([this.decipher.update(this.encrypted), this.decipher.final()]);
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
        signSession(hash, account, password) {
            return getService(constants_1.CORE_MODULE.GETH_CONNECTOR).getInstance()
                .web3
                .personal
                .signAsync(hash, account, password);
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