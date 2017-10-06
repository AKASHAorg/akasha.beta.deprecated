import { Validator } from 'jsonschema';
import {isValidAddress, isValidChecksumAddress} from 'ethereumjs-util';
import { multihash } from 'is-ipfs';

Validator.prototype.customFormats['address'] = function(input) {
    if (input) {
        return isValidAddress(input);
    }
    return true;
};

Validator.prototype.customFormats['checkSummedAddress'] = function(input) {
    if (input) {

        return isValidChecksumAddress(input);
    }
    return true;
};

Validator.prototype.customFormats['multihash'] = function(input) {
    if (input) {
        return multihash(input);
    }
    return true;
};

Validator.prototype.customFormats['buffer'] = function(input) {
    if (input) {
        return Buffer.isBuffer(input);
    }
    return true;
};

export default { Validator };
