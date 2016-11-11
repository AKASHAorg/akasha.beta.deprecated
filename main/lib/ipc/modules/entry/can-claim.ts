import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Check if can claim deposit from entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { entryId: string}) {
    const entryFund = yield contracts.instance.entries.getEntryFund(data.entryId);
    const active = yield contracts.instance.entries.isMutable(data.entryId);
    return { canClaim: !!(entryFund && !active), entryId: data.entryId };
});

export default { execute, name: 'canClaim' };
