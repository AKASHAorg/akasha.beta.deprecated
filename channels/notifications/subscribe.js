"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ramda_1 = require("ramda");
const constants_1 = require("@akashaproject/common/constants");
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
function init(sp, getService) {
    const execute = Promise.coroutine(function* (data, cb) {
        const v = new (getService(constants_1.CORE_MODULE.VALIDATOR_SCHEMA)).Validator();
        v.validate(data, subscribe, { throwError: true });
        const watchFilter = Object.assign({}, data.profile, { fromBlock: data.fromBlock });
        if (data.settings) {
            Object.keys(installedFilters).forEach((eventType) => {
                if (!data.settings[eventType] && installedFilters[eventType]) {
                    installedFilters[eventType].stopWatching(() => console.log('stopped watching event', eventType));
                    installedFilters[eventType] = null;
                    if (eventType === 'votes') {
                        getService(constants_1.NOTIFICATIONS_MODULE.entriesCache).reset();
                    }
                }
            });
        }
        if ((!data.settings ||
            ramda_1.isNil(data.settings.feed) ||
            data.settings.feed) &&
            !installedFilters.feed) {
            installedFilters.feed = yield getService(constants_1.NOTIFICATIONS_MODULE.feed)
                .execute(watchFilter, cb);
        }
        if ((!data.settings ||
            ramda_1.isNil(data.settings.donations) ||
            data.settings.donations) &&
            !installedFilters.donations) {
            installedFilters.donations = yield getService(constants_1.NOTIFICATIONS_MODULE.donations)
                .execute(watchFilter, cb);
        }
        if ((!data.settings ||
            ramda_1.isNil(data.settings.comments) ||
            data.settings.comments) &&
            !installedFilters.comments) {
            installedFilters.comments = yield getService(constants_1.NOTIFICATIONS_MODULE.comments)
                .execute(watchFilter, cb);
        }
        if ((!data.settings ||
            ramda_1.isNil(data.settings.votes) ||
            data.settings.votes) && !installedFilters.votes) {
            installedFilters.votes = yield getService(constants_1.NOTIFICATIONS_MODULE.votes)
                .execute(watchFilter, cb);
        }
        return { watching: true };
    });
    const subscribeT = { execute, name: 'subscribe', hasStream: true };
    const service = function () {
        return subscribeT;
    };
    sp().service(constants_1.NOTIFICATIONS_MODULE.subscribe, service);
    return subscribeT;
}
exports.default = init;
//# sourceMappingURL=subscribe.js.map