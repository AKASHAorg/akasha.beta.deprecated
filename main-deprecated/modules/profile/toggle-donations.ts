import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import getCurrentProfile from '../registry/current-profile';
import schema from '../utils/jsonschema';

export const toggleDonations = {
    'id': '/toggleDonations',
    'type': 'object',
    'properties': {
        'status': { 'type': 'boolean' },
        'token': { 'type': 'string' }
    },
    'required': ['token', 'status']
};

const execute = Promise.coroutine(
    function* (data: { status: boolean, token: string }, cb) {
        const v = new schema.Validator();
        v.validate(data, toggleDonations, { throwError: true });

        const currentProfile = yield getCurrentProfile.execute();
        if (!currentProfile.raw) {
            throw new Error('Need to register an akashaId to access this setting.');
        }

        const txData = contracts.instance
            .ProfileResolver
            .toggleDonations
            .request(currentProfile.raw, data.status, { gas: 200000 });
        const transaction = yield contracts.send(txData, data.token, cb);
        return {
            tx: transaction.tx,
            receipt: transaction.receipt
        };
    });

export default { execute, name: 'toggleDonations', hasStream: true };
