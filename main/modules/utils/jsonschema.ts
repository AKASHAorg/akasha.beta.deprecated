import { Validator } from 'jsonschema';
import {isValidAddress, isValidChecksumAddress} from 'ethereumjs-util';

Validator.prototype.customFormats['address'] = function(input) {
  return isValidAddress(input);
};

Validator.prototype.customFormats['checkSummedAddress'] = function(input) {
    return isValidChecksumAddress(input);
};

export default { Validator };
