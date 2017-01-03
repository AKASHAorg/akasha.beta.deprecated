"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const ipfs_1 = require('./ipfs');
const settings_1 = require('../../config/settings');
const following_count_1 = require('./following-count');
const followers_count_1 = require('./followers-count');
const entry_count_profile_1 = require('../entry/entry-count-profile');
const subs_count_1 = require('../tags/subs-count');
const execute = Promise.coroutine(function* (data) {
    const ipfsHash = yield index_1.constructed.instance.profile.getIpfs(data.profile);
    const profile = (data.full) ?
        yield ipfs_1.resolveProfile(ipfsHash, data.resolveImages)
            .timeout(settings_1.FULL_WAIT_TIME)
            .then((d) => d).catch((e) => null)
        :
            yield ipfs_1.getShortProfile(ipfsHash, data.resolveImages)
                .timeout(settings_1.SHORT_WAIT_TIME)
                .then((d) => d).catch((e) => null);
    const akashaId = yield index_1.constructed.instance.profile.getId(data.profile);
    const foCount = yield following_count_1.default.execute({ akashaId });
    const fwCount = yield followers_count_1.default.execute({ akashaId });
    const entriesCount = yield entry_count_profile_1.default.execute({ akashaId });
    const subscriptionsCount = yield subs_count_1.default.execute({ akashaId });
    return Object.assign({
        akashaId: akashaId,
        followingCount: foCount.count,
        followersCount: fwCount.count,
        entriesCount: entriesCount.count,
        subscriptionsCount: subscriptionsCount.count,
        [settings_1.BASE_URL]: settings_1.generalSettings.get(settings_1.BASE_URL),
        profile: data.profile
    }, profile);
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getProfileData' };
//# sourceMappingURL=profile-data.js.map