import {createCipher, createDecipher, randomBytes} from 'crypto';
import { GethConnector } from '@akashaproject/geth-connector';
import { Decipher } from 'crypto';
import { Cipher } from 'crypto';

export default class Auth {
    private _encrypted: Buffer;
    private _decipher: Decipher;
    private _cipher: Cipher;

    constructor() {
        this._generateRandom();
    }

    generateKey() {
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

    private _generateRandom() {
        randomBytes(256, (err, buff) => {
            if (err) {
                throw err;
            }
            this._cipher = createCipher('aes-256-cbc', buff.toString('hex'));
            this._decipher = createDecipher('aes-256-cbc', buff.toString('hex'));
        });
    }

    protected encrypt(key: Uint8Array[]) {
        const keyTr = Buffer.from(key);
        this._encrypted = Buffer.concat([this._cipher.update(keyTr), this._cipher.final()]);
    }

    private _read() {
        return Buffer.concat([this._decipher.update(this._encrypted) , this._decipher.final()]);
    }
}
