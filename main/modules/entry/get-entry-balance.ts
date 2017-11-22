import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { GethConnector } from '@akashaproject/geth-connector';

export const getEntryBalance = {
    'id': '/getEntryBalance',
    'type': 'array',
    'items': {
        'type': 'string'
    },
    'uniqueItems': true,
    'minItems': 1
};
/**
 * Get current balance of an entry
 * @type {Function}
 */
const execute = Promise.coroutine(
    /**
     *
     * @param data
     * @returns {{collection: any}}
     */
    function* (data: string[]) {
        const v = new schema.Validator();
        v.validate(data, getEntryBalance, { throwError: true });
        const collection = [];
        const requests = data.map((id) => {
            return contracts.instance.Votes.getRecord(id).then((result) => {
                const [_totalVotes, _score, _endPeriod, _totalKarma, _claimed] = result;
                collection.push({
                    entryId: id,
                    totalVotes: _totalVotes.toString(10),
                    score: _score.toString(10),
                    endPeriod: (new Date(_endPeriod.toNumber() * 1000)).toISOString(),
                    totalKarma: (GethConnector.getInstance().web3.fromWei(_totalKarma, 'ether')).toString(10),
                    claimed: _claimed
                });
            });
        });
        yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'getEntryBalance' };
