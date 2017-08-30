import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { profiles } from '../models/records';
import { is, isEmpty } from 'ramda';
import * as Promise from 'bluebird';

export const ProfileSchema = {
    AVATAR: 'avatar',
    LINKS: 'links',
    ABOUT: 'about',
    BACKGROUND_IMAGE: 'backgroundImage'
};

/**
 *
 * @type {Function}
 */
export const create = Promise.coroutine(function* (data: IpfsProfileCreateRequest) {
    let saved, tmp, targetHash, keys, pool;
    let i = 0;
    const simpleLinks = [ProfileSchema.AVATAR, ProfileSchema.ABOUT, ProfileSchema.LINKS];
    const root = yield IpfsConnector.getInstance().api.add({ firstName: data.firstName, lastName: data.lastName });
    targetHash = root.hash;
    while (i < simpleLinks.length) {
        if (!isEmpty(data[simpleLinks[i]]) && data[simpleLinks[i]]) {
            tmp = yield IpfsConnector.getInstance()
                .api
                .add(
                    data[simpleLinks[i]],
                    simpleLinks[i] === ProfileSchema.AVATAR,
                    (simpleLinks[i] === ProfileSchema.AVATAR) && is(String, data[simpleLinks[i]])
                );
            saved = yield IpfsConnector.getInstance()
                .api
                .addLink({ name: simpleLinks[i], size: tmp.size, hash: tmp.hash }, targetHash);
            targetHash = saved.multihash;
        }
        i++;
    }


    if (data.backgroundImage) {
        keys = Object.keys(data.backgroundImage).sort();
        pool = keys.map((media: string) => {
            return IpfsConnector.getInstance()
                .api
                .add(data.backgroundImage[media].src, true, is(String, data.backgroundImage[media].src));
        });
        tmp = yield Promise.all(pool).then(
            (returned) => {
                const constructed = {};
                returned.forEach((v: any, i: number) => {
                    const dim = keys[i];
                    constructed[dim] = {};
                    constructed[dim]['width'] = data.backgroundImage[dim].width;
                    constructed[dim]['height'] = data.backgroundImage[dim].height;
                    constructed[dim]['src'] = v.hash;
                });
                return IpfsConnector.getInstance().api.add(constructed);
            });
        saved = yield IpfsConnector.getInstance().api.addLink({
            name: 'backgroundImage',
            size: tmp.size,
            hash: tmp.hash
        }, targetHash);
        targetHash = saved.multihash;
    }

    saved = null;
    tmp = null;
    keys = null;
    pool = null;

    return targetHash;
});


/**
 *
 * @type {Function}
 */
export const getShortProfile = Promise.coroutine(function* (hash: string, resolveAvatar = false) {
    if (profiles.getShort(hash)) {
        return Promise.resolve(profiles.getShort(hash));
    }
    const avatarPath = { [ProfileSchema.AVATAR]: '' };
    const aboutPath = { [ProfileSchema.ABOUT]: '' };

    const profileBase = yield IpfsConnector.getInstance().api.get(hash);
    const avatar = yield IpfsConnector.getInstance().api.findLinks(hash, [ProfileSchema.AVATAR]);
    const about = yield IpfsConnector.getInstance().api.findLinks(hash, [ProfileSchema.ABOUT]);
    if (avatar.length) {
        if (!resolveAvatar) {
            avatarPath[ProfileSchema.AVATAR] = avatar[0].multihash;
        } else {
            avatarPath[ProfileSchema.AVATAR] = yield IpfsConnector.getInstance().api.getFile(avatar[0].multihash);
        }
    }
    if (about.length) {
        aboutPath[ProfileSchema.ABOUT] = yield IpfsConnector.getInstance().api.get(about[0].multihash);
    }
    const fetched = Object.assign({}, profileBase, avatarPath, aboutPath);
    profiles.setShort(hash, fetched);
    return fetched;
});

/**
 *
 * @type {Function}
 */
export const resolveProfile = Promise.coroutine(function* (hash: string, resolveImages = false) {
    if (profiles.getFull(hash)) {
        return Promise.resolve(profiles.getFull(hash));
    }
    let constructed = {
        [ProfileSchema.LINKS]: [],
        [ProfileSchema.ABOUT]: '',
        [ProfileSchema.BACKGROUND_IMAGE]: ''
    };
    const shortProfile = yield getShortProfile(hash, resolveImages);
    const pool = yield IpfsConnector.getInstance()
        .api.findLinks(hash, [ProfileSchema.LINKS, ProfileSchema.BACKGROUND_IMAGE]);
    for (let i = 0; i < pool.length; i++) {
        constructed[pool[i].name] = yield IpfsConnector.getInstance().api.get(pool[i].multihash);
    }
    const returned = Object.assign({}, shortProfile, constructed);
    profiles.setFull(hash, returned);
    return returned;
});
