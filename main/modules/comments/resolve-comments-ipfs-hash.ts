import * as Promise from 'bluebird';
import { getCommentContent } from './ipfs';
import { FULL_WAIT_TIME, INSTANT_WAIT_TIME, MEDIUM_WAIT_TIME, SHORT_WAIT_TIME } from '../../config/settings';

/**
 * Resolve comments ipfs hashes
 * @type {Function}
 */

const execute = Promise.coroutine(function* (data: string[], cb: any) {
    const waitTimes = [INSTANT_WAIT_TIME, SHORT_WAIT_TIME, MEDIUM_WAIT_TIME, FULL_WAIT_TIME];
    let count = 0;
    let resolved = [];
    const unresolved = [];

    data.forEach((ipfsHash) => {
        getCommentContent(ipfsHash)
            .then((d) => resolved.push(d))
            .catch((e) => unresolved.push(ipfsHash))
            .finally(() => {
                count++;
                if (count === data.length && unresolved.length) {
                    cb(null, { unresolved: unresolved });
                }
            });
    });

    for (let time of waitTimes) {
        setTimeout(() => {
            if (resolved.length > 0) {
                cb(null, { resolved: resolved });
            }
            resolved = [];
        }, time);
    }

    return {};
});

export default { execute, name: 'resolveCommentsIpfsHash', hasStream: true };
