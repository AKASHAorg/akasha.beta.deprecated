import * as Promise from 'bluebird';
import { CORE_MODULE, TAGS_MODULE } from '@akashaproject/common/constants';
const tagIteratorSchema = {
    id: '/tagIterator',
    type: 'object',
    properties: {
        limit: { type: 'number' },
        toBlock: { type: 'number' },
    },
    required: ['toBlock'],
};
export default function init(sp, getService) {
    const execute = Promise
        .coroutine(function* (data) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, tagIteratorSchema, { throwError: true });
        const collection = [];
        const maxResults = data.limit || 5;
        const contracts = getService(CORE_MODULE.CONTRACTS);
        const web3Api = getService(CORE_MODULE.WEB3_API);
        const fetched = yield contracts.fromEvent(contracts.instance.Tags.TagCreate, {}, data.toBlock, maxResults, {});
        for (const event of fetched.results) {
            collection.push({ tag: web3Api.instance.toUtf8(event.args.tag) });
            if (collection.length === maxResults) {
                break;
            }
        }
        return { collection, lastBlock: fetched.fromBlock };
    });
    const tagIterator = { execute, name: 'tagIterator' };
    const service = function () {
        return tagIterator;
    };
    sp().service(TAGS_MODULE.tagIterator, service);
    return tagIterator;
}
//# sourceMappingURL=tags-iterator.js.map