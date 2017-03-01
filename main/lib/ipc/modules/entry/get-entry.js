"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const index_1 = require("../../contracts/index");
const ipfs_1 = require("./ipfs");
const settings_1 = require("../../config/settings");
const comments_count_1 = require("../comments/comments-count");
const profile_data_1 = require("../profile/profile-data");
const execute = Promise.coroutine(function* (data) {
    const entryEth = yield index_1.constructed.instance.entries.getEntry(data.entryId);
    const active = yield index_1.constructed.instance.entries.isMutable(data.entryId);
    const score = yield index_1.constructed.instance.votes.getScore(data.entryId);
    const cCount = yield comments_count_1.default.execute({ entryId: data.entryId });
    entryEth.publisher = yield profile_data_1.default.execute({ profile: entryEth.publisher })
        .timeout(settings_1.SHORT_WAIT_TIME)
        .then((d) => d).catch((e) => null);
    const content = (data.full) ?
        yield ipfs_1.getFullContent(entryEth.ipfsHash, data.version)
            .timeout(settings_1.FULL_WAIT_TIME)
            .then((d) => d).catch((e) => null)
        :
            yield ipfs_1.getShortContent(entryEth.ipfsHash)
                .timeout(settings_1.SHORT_WAIT_TIME)
                .then((d) => d).catch((e) => null);
    return {
        [settings_1.BASE_URL]: settings_1.generalSettings.get(settings_1.BASE_URL),
        content,
        entryEth,
        entryId: data.entryId,
        score,
        active,
        commentsCount: cCount.count
    };
});
exports.default = { execute, name: 'getEntry' };
//# sourceMappingURL=get-entry.js.map