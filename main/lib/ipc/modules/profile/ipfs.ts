import { IpfsConnector, IpfsApiHelper } from '@akashaproject/ipfs-connector';
import { profiles } from '../models/records';
import * as Promise from 'bluebird';
/**
 *
 * @param data
 * @returns {Thenable<U>|PromiseLike<TResult>|Promise<TResult>|Bluebird<U>}
 */
const create = (data: IpfsProfileCreateRequest) => {
    const returned: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: '',
        backgroundImage: '',
        about: '',
        links: ''
    };
    let media: any[] = [];
    let keys: any;
    if (data.backgroundImage) {
        keys = Object.keys(data.backgroundImage).sort();
        media = keys.map((media: string) => {
            return IpfsConnector.getInstance()
                .api
                .constructObjLink(data.backgroundImage[media].src, true);
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
                    .constructObjLink(data.avatar, true);
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
            if (data.links) {
                return IpfsConnector.getInstance().api.constructObjLink(data.links)
            }
            return Promise.resolve('');
        }).then((hash: any) => {
            if (hash) {
                returned.links = hash;
            }
            return IpfsConnector.getInstance().api.add(returned);
        });
};

/**
 *
 * @param hash
 * @param resolveAvatar
 * @returns {any}
 */
const getShortProfile = (hash: string, resolveAvatar = false) => {
    if (profiles.getShort(hash)) {
        return Promise.resolve(profiles.getShort(hash));
    }
    return IpfsConnector.getInstance().api.get(hash)
        .then((schema: ProfileModel) => {
            let resolved: any = Object.assign({}, schema);
            if (schema.avatar) {
                if (resolveAvatar) {
                    return IpfsConnector.getInstance()
                        .api
                        .resolve(`${hash}/avatar`)
                        .then((data: Buffer) => {
                            resolved.avatar = data;
                            profiles.setShort(hash, resolved);
                            return resolved;
                        });
                }
                resolved.avatar = schema.avatar[IpfsApiHelper.LINK_SYMBOL];
            }
            profiles.setShort(hash, resolved);
            return resolved;
        });
};

/**
 *
 * @param hash
 * @param resolveImages
 * @returns {any}
 */
const resolveProfile = (hash: string, resolveImages = false) => {
    let resolved: any;
    let keys: any;

    if (profiles.getFull(hash)) {
        return Promise.resolve(profiles.getFull(hash));
    }

    return getShortProfile(hash, resolveImages)
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
                if (resolveImages) {
                    media = keys.map((media: string) => {
                        return IpfsConnector.getInstance()
                            .api
                            .resolve(resolved.backgroundImage[media].src);
                    });
                    return Promise.all(media);
                }
            }
            return Promise.resolve('');
        }).then((images: any) => {
            if (images.length) {
                images.forEach((v: Buffer, i: number) => {
                    resolved.backgroundImage[keys[i]].src = v;
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

            if (resolved.links) {
                return IpfsConnector.getInstance()
                    .api
                    .resolve(resolved.links);
            }
            return Promise.resolve('');
        }).then((links: any) => {
            if (links) {
                resolved.links = links;
            }

            profiles.setFull(hash, resolved);
            return resolved;
        });
};

/**
 *
 * @returns {{create: ((data:IpfsProfileCreateRequest)=>Bluebird<U>),
 * getShortProfile: ((hash:string, resolveAvatar?:boolean)=>(Bluebird<R>|any)),
 * resolveProfile: ((hash:string, resolveImages?:boolean)=>(Bluebird<R>|Bluebird<U>))}}
 */
export default function init() {
    return {
        create,
        getShortProfile,
        resolveProfile
    };
}
