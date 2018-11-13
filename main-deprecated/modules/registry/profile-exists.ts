import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { unpad } from 'ethereumjs-util';
import schema from '../utils/jsonschema';
import { checkIdFormat } from './check-id-format';
import { normaliseId } from '../profile/helpers';

/**
 * Check if provided `akashaId` is taken
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileExistsRequest) {
    const v = new schema.Validator();
    v.validate(data, checkIdFormat, { throwError: true });

    let normalisedId = '';
    let exists = '0x0';
    let idValid = false;
    try {
        normalisedId = normaliseId(data.akashaId);
        const idHash = yield contracts.instance.ProfileRegistrar.hash(normalisedId);
        exists = yield contracts.instance.ProfileResolver.addr(idHash);
        idValid = yield contracts.instance.ProfileRegistrar.check_format(normalisedId);
    } catch (err) {

    }

    return { exists: !!unpad(exists), idValid, akashaId: data.akashaId, normalisedId };
});

export default { execute, name: 'profileExists' };

