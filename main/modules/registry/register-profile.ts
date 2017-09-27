import { create } from '../profile/ipfs';
import { decodeHash } from '../ipfs/helpers';
import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';

export const registerProfile = {
    'id': '/registerProfile',
    'type': 'object',
    'properties': {
        'akashaId': { 'type': 'string', 'minLength': 2 },
        'ethAddress': { 'type': 'string', 'format': 'address' },
        'donations': {'type': 'boolean'},
        'ipfs': {
            'type': 'object',
            'properties': {
                'firstName': {'type': 'string'},
                'lastName': {'type': 'string'},
                'avatar': {'type': 'any'},
                'backgroundImage': {'type': 'any'},
                'about': {'type': 'string'},
                'links': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'title': {'type': 'string'},
                            'url': {'type': 'string'},
                            'type': {'type': 'string'},
                            'id': {'type': 'number'}
                        },
                        'required': ['title', 'url', 'type', 'id']
                    }
                }
            }
        }

    },
    'required': ['akashaId', 'ethAddress', 'donations', 'ipfs']
};
/**
 * Register a new AKASHA ID
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: ProfileCreateRequest, cb) {
    const v = new schema.Validator();
    v.validate(data, registerProfile, { throwError: true });

    const ipfsHash = yield create(data.ipfs);
    const [fn, digest, hash] = decodeHash(ipfsHash);
    const txData = contracts.instance
        .ProfileRegistrar
        .register.request(data.akashaId, data.donations, hash, fn, digest, { gas: 400000, from: data.ethAddress});
    const transaction = yield contracts.send(txData, data.token, cb);
    return { tx: transaction.tx, receipt: transaction.receipt };
});

export default { execute, name: 'registerProfile', hasStream: true };
