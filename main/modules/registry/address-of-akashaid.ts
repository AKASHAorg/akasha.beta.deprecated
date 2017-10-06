import * as Promise from 'bluebird';
import { unpad } from 'ethereumjs-util';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { checkIdFormat } from './check-id-format';

export const addressOf = {
    'id': '/addressOf',
    'type': 'array',
    'items': {
        '$ref': '/checkIdFormat'
    },
    'uniqueItems': true,
    'minItems': 1
};
/**
 * Resolve akashaId[] to a contract address
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileExistsRequest[]) {
    const v = new schema.Validator();
    v.addSchema(checkIdFormat, '/checkIdFormat');
    v.validate(data, addressOf, { throwError: true });

    const batch = data.map(
        (profile) => {
            return contracts.instance.ProfileResolver.addr(profile.akashaId).then((address) => {
                return { address: unpad(address), akashaId: profile.akashaId };
            });
        }
    );
    const collection = yield Promise.all(batch);
    return { collection };
});

export default { execute, name: 'addressOf' };

