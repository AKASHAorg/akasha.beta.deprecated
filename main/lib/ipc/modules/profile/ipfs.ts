import { IpfsConnector } from '@akashaproject/ipfs-connector';
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
        links: data.links
    };
    let media: any[] = [];
    let keys: any;
    if (data.backgroundImage) {
        keys = Object.keys(data.backgroundImage).sort();
        media = keys.map((media: string) => {
            return IpfsConnector.getInstance()
                .api
                .addFile(Buffer.from(data.backgroundImage[media].src));
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
                    .addFile(Buffer.from(data.avatar));
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
                    .add(transformed);
            }
            return Promise.resolve('');
        }).then((hash: any) => {
            if (hash) {
                returned.about = hash;
            }
            return IpfsConnector.getInstance().api.add(returned);
        });
};

/**
 *
 * @param hash
 * @returns {any}
 */
const getShortProfile = (hash: string) => {
    if (profiles.records.getShort(hash)) {
        return Promise.resolve(profiles.records.getShort(hash));
    }
    return IpfsConnector.getInstance().api.get(hash)
        .then((schema: ProfileModel) => {
            let resolved: any = Object.assign({}, schema);
            if (schema.avatar) {
                return IpfsConnector.getInstance()
                    .api
                    .resolve(schema.avatar)
                    .then((data: Buffer) => {
                        resolved.avatar = Uint8Array.from(data);
                        return resolved;
                    });
            }
            profiles.records.setShort(hash, resolved);
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

    if (profiles.records.getFull(hash)) {
        return Promise.resolve(profiles.records.getFull(hash));
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
            profiles.records.setFull(hash, resolved);
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
