import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';


/**
 * Get vote weight of akasha id
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: {entryId: string, akashaId: string}) {
    const profileAddress = yield contracts.instance.registry.addressOf(data.akashaId);
    const weight = yield contracts.instance.votes.getVoteOfProfile(data.entryId, profileAddress);
    return { weight, entryId: data.entryId, akashaId: data.akashaId };
});

export default { execute, name: 'getVoteOf' };

