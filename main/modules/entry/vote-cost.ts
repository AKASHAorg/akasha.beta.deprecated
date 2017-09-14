import * as Promise from 'bluebird';
import contracts from '../../contracts/index';

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
    function* (data: { weight: number[] }) {
        if (!Array.isArray(data.weight)) {
            throw new Error('data.weight must be an array');
        }
        const requests = data.weight.map((w) => {
            return contracts.instance.votes.getVoteCost(w)
                .then((cost) => {
                    return { cost, weight: w };
                });
        });

        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'voteCost' };
