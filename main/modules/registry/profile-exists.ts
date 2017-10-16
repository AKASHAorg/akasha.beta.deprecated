import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { unpad } from 'ethereumjs-util';
import schema from '../utils/jsonschema';
import { checkIdFormat } from './check-id-format';

/**
 * Check if provided `akashaId` is taken
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileExistsRequest) {
    const v = new schema.Validator();
    v.validate(data, checkIdFormat, { throwError: true });

    const exists = yield contracts.instance.ProfileResolver.addr(data.akashaId);
    const idValid = yield contracts.instance.ProfileRegistrar.check_format(data.akashaId);
    return { exists: !!unpad(exists), idValid, akashaId: data.akashaId };
});

export default { execute, name: 'profileExists' };

