import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import GethConnector from '@akashaproject/geth-connector/lib/GethConnector';

export const voteCost = {
    'id': '/voteCost',
    'type': 'array',
    'items': { 'type': 'number' },
    'uniqueItems': true,
    'minItems': 1
};

/**
 * Get cost value for vote weight
 * @type {Function}
 */
const execute = Promise.coroutine(
    /**
     *
     * @param data
     * @returns {{collection: any}}
     */
    function* (data: number[]) {
        const v = new schema.Validator();
        v.validate(data, voteCost, { throwError: true });

        const requests = data.map((w) => {
            return contracts.instance.Votes.getEssenceCost(w)
                .then((cost) => {
                    const ethCost = GethConnector.getInstance().web3.fromWei(cost, 'ether');
                    return { cost: ethCost.toString(10), weight: w };
                });
        });

        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'voteCost' };
