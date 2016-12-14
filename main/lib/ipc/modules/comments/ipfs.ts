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
        content: data,
        date
    };
    return IpfsConnector.getInstance().api
        .add(constructed)
        .then((result: any) => result.hash)
}


/**
 *
 * @param hash
 * @returns {any}
 */
export function getCommentContent(hash) {
    if (comments.getFull(hash)) {
        return Promise.resolve(comments.getFull(hash));
    }
    return IpfsConnector.getInstance().api
        .get(hash)
        .then((data) => {
            comments.setFull(hash, data);
            return data;
        })
}

