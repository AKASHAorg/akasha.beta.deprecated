import * as Promise from 'bluebird';
import { isNil } from 'ramda';
import * as feed from './feed';
import * as donations from './donations';

const execute = Promise.coroutine(function* (data: {
                                                 settings?: { feed?: boolean, donations?: boolean },
                                                 profile: { ethAddress?: string, akashaId?: string },
                                                 fromBlock: number
                                             },
                                             cb) {
    if (!data.settings || isNil(data.settings.feed) || data.settings.feed) {
        yield feed.execute(Object.assign({}, data.profile, { fromBlock: data.fromBlock }), cb);
    }

    if (!data.settings || isNil(data.settings.donations) || data.settings.donations) {
        yield donations.execute(Object.assign({}, data.profile, { fromBlock: data.fromBlock }), cb);
    }
    return { watching: true };
});

export default { execute, name: 'subscribe', hasStream: true };
