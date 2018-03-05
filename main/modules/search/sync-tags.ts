import * as Promise from 'bluebird';
import { dbs } from './indexes';
import contracts from '../../contracts/index';
import schema from '../utils/jsonschema';
import { GethConnector } from '@akashaproject/geth-connector';

export const syncTags = {
    'id': '/syncTags',
    'type': 'object',
    'properties': {
        'fromBlock': {'type': 'number'}
    },
    'required': ['fromBlock']
};


const execute = Promise.coroutine(function* (data: { fromBlock: number }) {
    const v = new schema.Validator();
    v.validate(data, syncTags, { throwError: true });

    const tagCreateEvent = contracts.createWatcher(contracts.instance.Tags.TagCreate, {}, data.fromBlock);
    tagCreateEvent.watch((err, event) => {
        const data = { id: event.args.tag, tagName: event.args.tag };
        dbs.tags
            .searchIndex
             .concurrentAdd({}, [data], (err) => { if (err) { console.log(err); } });
    });
    const lastBlock = yield GethConnector.getInstance().web3.eth.getBlockNumberAsync();
    return { done: true, lastBlock };
});

export default { execute, name: 'syncTags'};
