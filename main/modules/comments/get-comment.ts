import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { getCommentContent } from './ipfs';
import { SHORT_WAIT_TIME } from '../../config/settings';
import getProfile from '../profile/profile-data';

/**
 * Get comment data for an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string, commentId: string }) {
    const ethData = yield contracts.instance.comments.getComment(data.entryId, data.commentId);
    const profile = yield getProfile.execute({ profile: ethData.profile })
        .timeout(SHORT_WAIT_TIME)
        .then((d) => d).catch((e) => null);

    const content = yield getCommentContent(ethData.ipfsHash);
    ethData.profile = profile;
    return { data: Object.assign(ethData, content), entryId: data.entryId, commentId: data.commentId };
});

export default { execute, name: 'getComment' };
