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

    const normalisedId = normaliseId(data.akashaId);
    const idHash = yield contracts.instance.ProfileRegistrar.hash(normalisedId);
    const exists = yield contracts.instance.ProfileResolver.addr(idHash);
    const idValid = yield contracts.instance.ProfileRegistrar.check_format(normalisedId);
    return { exists: !!unpad(exists), idValid, akashaId: data.akashaId, normalisedId };
});

export default { execute, name: 'profileExists' };

