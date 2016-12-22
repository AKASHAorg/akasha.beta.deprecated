import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Get cost value for vote weight
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { weight: number}) {
    const cost = yield contracts.instance.votes.getVoteCost(data.weight); // expressed in ethers
    return { cost, weight: data.weight };
});

export default { execute, name: 'voteCost' };
