import * as Promise from 'bluebird';
import { isNil } from 'ramda';
import { CORE_MODULE, NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';
const installedFilters = {
    feed: null,
    donations: null,
    comments: null,
    votes: null,
};
const subscribe = {
    id: '/subscribeSchema',
    type: 'object',
    properties: {
        settings: {
            type: 'object',
            properties: {
                feed: { type: 'boolean' },
                donations: { type: 'boolean' },
                comments: { type: 'boolean' },
                votes: { type: 'boolean' },
            },
            required: ['feed', 'donations', 'comments', 'votes'],
        },
        profile: {
            type: 'object',
            properties: {
                akashaId: { type: 'string' },
                ethAddress: { type: 'string', format: 'address' },
            },
        },
        fromBlock: { type: 'number' },
    },
    required: ['profile', 'fromBlock'],
};
export default function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, subscribe, { throwError: true });
        const watchFilter = Object.assign({}, data.profile, { fromBlock: data.fromBlock });
        if (data.settings) {
            Object.keys(installedFilters).forEach((eventType) => {
                if (!data.settings[eventType] && installedFilters[eventType]) {
                    installedFilters[eventType].stopWatching(() => console.log('stopped watching event', eventType));
                    installedFilters[eventType] = null;
                    if (eventType === 'votes') {
                        getService(NOTIFICATIONS_MODULE.entriesCache).reset();
                    }
                }
            });
        }
        if ((!data.settings ||
            isNil(data.settings.feed) ||
            data.settings.feed) &&
            !installedFilters.feed) {
            installedFilters.feed = yield getService(NOTIFICATIONS_MODULE.feed)
                .execute(watchFilter, cb);
        }
        if ((!data.settings ||
            isNil(data.settings.donations) ||
            data.settings.donations) &&
            !installedFilters.donations) {
            installedFilters.donations = yield getService(NOTIFICATIONS_MODULE.donations)
                .execute(watchFilter, cb);
        }
        if ((!data.settings ||
            isNil(data.settings.comments) ||
            data.settings.comments) &&
            !installedFilters.comments) {
            installedFilters.comments = yield getService(NOTIFICATIONS_MODULE.comments)
                .execute(watchFilter, cb);
        }
        if ((!data.settings ||
            isNil(data.settings.votes) ||
            data.settings.votes) && !installedFilters.votes) {
            installedFilters.votes = yield (getService(NOTIFICATIONS_MODULE.votes))
                .execute(watchFilter, cb);
        }
        return { watching: true };
    });
    const subscribeT = { execute, name: 'subscribe', hasStream: true };
    const service = function () {
        return subscribeT;
    };
    sp().service(NOTIFICATIONS_MODULE.subscribe, service);
    return subscribeT;
}
//# sourceMappingURL=subscribe.js.map