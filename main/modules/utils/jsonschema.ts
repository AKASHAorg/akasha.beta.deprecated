import { Validator } from 'jsonschema';
import {isValidAddress, isValidChecksumAddress} from 'ethereumjs-util';
import { multihash } from 'is-ipfs';

Validator.prototype.customFormats['address'] = function(input) {
  return isValidAddress(input);
};

Validator.prototype.customFormats['checkSummedAddress'] = function(input) {
    return isValidChecksumAddress(input);
};

Validator.prototype.customFormats['multihash'] = function(input) {
    return multihash(input);
};

export default { Validator };
