import * as Promise from 'bluebird';
import { constructed as contracts } from '../../contracts/index';

/**
 * Check if can claim deposit from entry
 */
const execute = Promise.coroutine(
    /**
     * @param data
     * @returns {{collection: any}}
     */
    function*(data: { entryId: string[] }) {
        if (!Array.isArray(data.entryId)) {
            throw new Error('data.entryId must be an array');
        }

        const requests = data.entryId.map((id) => {
            return Promise.all([
                contracts.instance.entries.getEntryFund(id),
                contracts.instance.entries.isMutable(id)
            ]).then((resolve) => {
                return { canClaim: !!(resolve[0] && !resolve[1]), entryId: id }
            })
        });
        const collection = yield Promise.all(requests);
        return { collection };
    });

export default { execute, name: 'canClaim' };
