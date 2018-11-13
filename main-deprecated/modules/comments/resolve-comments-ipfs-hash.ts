import * as Promise from 'bluebird';
import { getCommentContent } from './ipfs';
import schema from '../utils/jsonschema';


const resolveCommentsIpfsHash = {
    'id': '/resolveCommentsIpfsHash',
    'type': 'array',
    'items': {
        'type': 'string',
        'format': 'multihash'
    },
    'uniqueItems': true,
    'minItems': 1
};
/**
 * Resolve comments ipfs hashes
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: string[], cb: any) {
    const v = new schema.Validator();
    v.validate(data, resolveCommentsIpfsHash, { throwError: true });

    for (let ipfsHash of data) {
        getCommentContent(ipfsHash)
            .then((result) => cb('', Object.assign({}, result, { ipfsHash })));
    }
    return {};
});

export default { execute, name: 'resolveCommentsIpfsHash', hasStream: true };
