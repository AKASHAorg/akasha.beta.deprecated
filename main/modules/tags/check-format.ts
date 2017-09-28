import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

const checkFormat = {
    'id': '/checkFormat',
    'type': 'object',
    'properties': {
        'tagName': { 'type': 'string' }
    },
    'required': ['tagName']
};

/**
 * Get tagName for tagId
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: TagAtNameRequest) {
    const v = new schema.Validator();
    v.validate(data, checkFormat, { throwError: true });

    const status = yield contracts.instance.Tags.checkFormat(data.tagName);
    return { status, tagName: data.tagName };
});

export default { execute, name: 'checkFormat' };

