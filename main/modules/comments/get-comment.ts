import * as Promise from 'bluebird';
import contracts from '../../contracts/index';
import { encodeHash } from '../ipfs/helpers';
import resolve from '../registry/resolve-ethaddress';

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

    return {
        parent,
        author,
        deleted,
        publishDate: (new Date(publishDate.toNumber() * 1000)).toISOString(),
        ipfsHash
    };
});

export default { execute, name: 'getComment' };
