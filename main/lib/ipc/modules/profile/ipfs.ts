import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { profiles } from '../models/records';
import * as Promise from 'bluebird';
/**
 *
 * @param data
 * @returns {Thenable<U>|PromiseLike<TResult>|Promise<TResult>|Bluebird<U>}
 */
const create = (data: IpfsProfileCreateRequest) => {
    console.time('creating_ipfs');
    const returned: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: '',
        backgroundImage: '',
        about: '',
        links: data.links
    };
    let media: any[] = [];
    let keys: any;
    if (data.backgroundImage) {
        keys = Object.keys(data.backgroundImage).sort();
        media = keys.map((media: string) => {
            return IpfsConnector.getInstance()
                .api
                .constructObjLink(Buffer.from(data.backgroundImage[media].src), true);
        });
    }
    return Promise.all(media)
        .then((hashes) => {
            let constructed: any = {};
            if (hashes.length) {
                hashes.forEach((v: any, i: number) => {
                    const dim = keys[i];
                    constructed[dim] = {};
                    constructed[dim]['width'] = data.backgroundImage[dim].width;
                    constructed[dim]['height'] = data.backgroundImage[dim].height;
                    constructed[dim]['src'] = v;
                });
                // cleanup
                delete data.backgroundImage;
                return IpfsConnector.getInstance().api.add(constructed).then((hash: string) => {
                    return IpfsConnector.getInstance().api.constructObjLink(hash);
                });
            }
            return Promise.resolve('');
        }).then((hash: any) => {
            if (hash) {
                returned.backgroundImage = hash;
            }
            if (data.avatar) {
                return IpfsConnector.getInstance()
                    .api
                    .constructObjLink(Buffer.from(data.avatar), true);
            }
            return Promise.resolve('');
        }).then((hash: any) => {
            if (hash) {
                returned.avatar = hash;
            }
            if (data.about) {
                const transformed = Buffer.from(data.about);
                return IpfsConnector.getInstance()
                    .api
                    .constructObjLink(transformed);
            }
            return Promise.resolve('');
        }).then((hash: any) => {
            if (hash) {
                returned.about = hash;
            }
            console.timeEnd('creating_ipfs');
            console.log(returned);
            return IpfsConnector.getInstance().api.add(returned);
        });
};

/**
 *
 * @param hash
 * @param resolveAvatar
 * @returns {any}
 */
const getShortProfile = (hash: string, resolveAvatar = true) => {
    if (profiles.getShort(hash)) {
        return Promise.resolve(profiles.getShort(hash));
    }
    return IpfsConnector.getInstance().api.get(hash)
        .then((schema: ProfileModel) => {
            let resolved: any = Object.assign({}, schema);
            console.log(resolved);
            if (schema.avatar && resolveAvatar) {
                return IpfsConnector.getInstance()
                    .api
                    .resolve(`${hash}/avatar`)
                    .then((data: Buffer) => {
                        resolved.avatar = Buffer.from(data);
                        return resolved;
                    });
            }
            profiles.setShort(hash, resolved);
            return resolved;
        });
};

/**
 *
 * @param hash
 * @returns {Bluebird<U>|Thenable<U>|Promise<TResult>|PromiseLike<TResult>}
 */
const resolveProfile = (hash: string) => {
    let resolved: any;
    let keys: any;

    if (profiles.getFull(hash)) {
        return Promise.resolve(profiles.getFull(hash));
    }

    return getShortProfile(hash)
        .then((schema: ProfileModel) => {
            resolved = Object.assign({}, schema);
            const LINKS: any[] = [];
            if (schema.backgroundImage) {
                return IpfsConnector.getInstance().api.resolve(schema.backgroundImage);
            }
            return Promise.resolve('');
        }).then((mediaObj: any): Promise<any> => {
            let media: any;
            if (mediaObj) {
                keys = Object.keys(mediaObj).sort();
                resolved.backgroundImage = mediaObj;
                media = keys.map((media: string) => {
                    return IpfsConnector.getInstance()
                        .api
                        .resolve(resolved.backgroundImage[media].src);
                });
                return Promise.all(media);
            }
            return Promise.resolve('');
        }).then((images: any) => {
            if (images.length) {
                images.forEach((v: Buffer, i: number) => {
                    resolved.backgroundImage[keys[i]].src = Uint8Array.from(v);
                });
            }
            if (resolved.about) {
                return IpfsConnector.getInstance()
                    .api
                    .resolve(resolved.about);
            }
            return Promise.resolve('');
        }).then((about: any) => {
            if (about) {
                resolved.about = Buffer.from(about).toString('utf8');
            }
            profiles.setFull(hash, resolved);
            return resolved;
        });
};

/**
 *
 * @returns {{
 *  create: ((data:IpfsProfileCreateRequest)=>Bluebird<U>),
  * getShortProfile: ((hash:string)=>any), resolveProfile: ((hash:string)=>any)
  * }}
 */
export default function init() {
    return {
        create,
        getShortProfile,
        resolveProfile
    };
}
