"use strict";
const Promise = require('bluebird');
const index_1 = require('../../contracts/index');
const ipfs_1 = require('./ipfs');
const profile_data_1 = require('../profile/profile-data');
const execute = Promise.coroutine(function* (data) {
    const ethData = yield index_1.constructed.instance.comments.getComment(data.entryId, data.commentId);
    const profile = yield profile_data_1.default.execute({ profile: ethData.profile });
    const content = yield ipfs_1.getCommentContent(ethData.ipfsHash);
    ethData.profile = profile;
    return { data: Object.assign(ethData, content), entryId: data.entryId, commentId: data.commentId };
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = { execute, name: 'getComment' };
//# sourceMappingURL=get-comment.js.map