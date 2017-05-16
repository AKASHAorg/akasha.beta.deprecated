import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Check if can claim deposit from entry
 * @type {Function}
 */
const execute = Promise.coroutine(function*(data: { entryId: string }) {
    const active = yield contracts.instance.entries.isMutable(data.entryId);
    return { active: active, entryId: data.entryId };
});

export default { execute, name: 'isActive' };
