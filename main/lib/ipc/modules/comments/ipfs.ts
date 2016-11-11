import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { comments } from '../models/records';

/**
 *
 * @param data
 * @returns {any}
 */
export function create(data) {
    const date = (new Date()).toJSON();
    const constructed = {
        content: data.content,
        date
    };
    return IpfsConnector.getInstance().api
        .add(constructed)
        .then((hash: string) => hash)
}


/**
 *
 * @param hash
 * @returns {any}
 */
export function getCommentContent(hash) {
    if (comments.records.getFull(hash)) {
        return Promise.resolve(comments.records.getFull(hash));
    }
    return IpfsConnector.getInstance().api
        .get(hash)
        .then((data) => {
            comments.records.setFull(hash, data);
            return data;
        })
}

