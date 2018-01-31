import * as Promise from 'bluebird';
import { isNil } from 'ramda';
import * as feed from './feed';
import * as donations from './donations';
import * as comments from './comments';
import * as votes from './votes';
import schema from '../utils/jsonschema';
import entriesCache from './entries';

const installedFilters = {
    feed: null,
    donations: null,
    comments: null,
    votes: null
};
const subscribe = {
    'id': '/subscribeSchema',
    'type': 'object',
    'properties': {
        'settings': {
            'type': 'object',
            'properties': {
                'feed': { 'type': 'boolean' },
                'donations': { 'type': 'boolean' },
                'comments': { 'type': 'boolean' },
                'votes': { 'type': 'boolean' }
            },
            'required': ['feed', 'donations', 'comments', 'votes']
        },
        'profile': {
            'type': 'object',
            'properties': {
                'akashaId': { 'type': 'string' },
                'ethAddress': { 'type': 'string', 'format': 'address' }
            }
        },
        'fromBlock': {'type': 'number'},
    },
    'required' : ['profile', 'fromBlock']
};
const execute = Promise.coroutine(function* (data: {
                                                 settings?: { feed: boolean, donations: boolean, comments: boolean, votes: boolean },
                                                 profile: { ethAddress?: string, akashaId?: string },
                                                 fromBlock: number
                                             },
                                             cb) {
    const v = new schema.Validator();
    v.validate(data, subscribe, { throwError: true });

    const watchFilter = Object.assign({}, data.profile, { fromBlock: data.fromBlock });
    if (data.settings) {
        Object.keys(installedFilters).forEach((eventType) => {
            if (!data.settings[eventType] && installedFilters[eventType]) {
                installedFilters[eventType].stopWatching(() => console.log('stopped watching event', eventType));
                installedFilters[eventType] = null;
                if (eventType === 'votes') {
                    entriesCache.reset();
                }
            }
        });
    }
    if ((!data.settings || isNil(data.settings.feed) || data.settings.feed) && !installedFilters.feed) {
        installedFilters.feed = yield feed.execute(watchFilter, cb);
    }

    if ((!data.settings || isNil(data.settings.donations) || data.settings.donations) && !installedFilters.donations) {
        installedFilters.donations = yield donations.execute(watchFilter, cb);
    }

    if ((!data.settings || isNil(data.settings.comments) || data.settings.comments) && !installedFilters.comments) {
        installedFilters.comments = yield comments.execute(watchFilter, cb);
    }

    if ((!data.settings || isNil(data.settings.votes) || data.settings.votes) && !installedFilters.votes) {
        installedFilters.votes = yield votes.execute(watchFilter, cb);
    }

    return { watching: true };
});

export default { execute, name: 'subscribe', hasStream: true };
