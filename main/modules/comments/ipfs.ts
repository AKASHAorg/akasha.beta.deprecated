import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { comments } from '../models/records';
import { FULL_WAIT_TIME } from '../../config/settings';

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
        .then((result: any) => result.hash);
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
        .timeout(FULL_WAIT_TIME)
        .then((data) => {
            comments.setFull(hash, data);
            return data;
        }).catch((e) => {
            return { content: null };
        });
}

