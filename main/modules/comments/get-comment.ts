import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { encodeHash } from '../ipfs/helpers';
import { getCommentContent } from './ipfs';
import resolve from '../registry/resolve-ethaddress';
import { unpad } from 'ethereumjs-util';

/**
 * Get comment data for an entry
 * @type {Function}
 */
const execute = Promise.coroutine(function* (data: { entryId: string, commentId: string }) {
    const [
        parent, ethAddress, deleted,
        publishDate, fn, digestSize, hash
    ] = yield contracts.instance.Comments.getComment(data.entryId, data.commentId);
    const ipfsHash = encodeHash(fn, digestSize, hash);
    const author = yield resolve.execute({ ethAddress: ethAddress });
    const content = yield getCommentContent(ipfsHash);
    return Object.assign(
        {},
        content,
        {
        parent: (!!unpad(parent)) ? parent : null,
        author,
        deleted,
        publishDate: publishDate.toNumber()
    });
});

export default { execute, name: 'getComment' };
