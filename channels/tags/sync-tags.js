import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';
export const syncTagsSchema = {
    id: '/syncTags',
    type: 'object',
    properties: {
        fromBlock: { type: 'number' },
    },
    required: ['fromBlock'],
};
export default function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, syncTagsSchema, { throwError: true });
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const tagCreateEvent = contracts.createWatcher(contracts.instance.Tags.TagCreate, {}, data.fromBlock);
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const dbIndex = getService(CORE_MODULE.DB_INDEX);
        const toUtf8 = web3Api.instance.toUtf8;
        tagCreateEvent.watch((err, event) => {
            const data = { id: event.args.tag, tagName: toUtf8(event.args.tag) };
            dbIndex.tags
                .searchIndex
                .concurrentAdd({}, [data], (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });
        const lastBlock = yield web3Api.instance.eth.getBlockNumber();
        return { lastBlock, done: true };
    });
    const syncTags = { execute, name: 'syncTags' };
    const service = function () {
        return syncTags;
    };
    sp().service(TAGS_MODULE.syncTags, service);
    return syncTags;
}
//# sourceMappingURL=sync-tags.js.map