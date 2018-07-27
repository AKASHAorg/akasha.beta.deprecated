import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

export const checkIdFormat = {
    'id': '/checkIdFormat',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string', 'minLength': 2 }
    },
    'required': ['akashaId']
};
/**
 * Check if format is ok
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileExistsRequest) {
    const v = new schema.Validator();
    v.validate(data, checkIdFormat, { throwError: true });

    const idValid = yield contracts.instance.ProfileRegistrar.check_format(data.akashaId);
    return { idValid, akashaId: data.akashaId };
});

export default { execute, name: 'checkIdFormat' };

