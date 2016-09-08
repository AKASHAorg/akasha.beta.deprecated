import { IpfsConnector } from '@akashaproject/ipfs-connector';
import * as Promise from 'bluebird';

/**
 *
 * @param data
 * @returns {Thenable<U>|PromiseLike<TResult>|Promise<TResult>|Bluebird<U>}
 */
const create = (data: IpfsProfileCreateRequest) => {
    const returned = Object.assign({}, data);
    let media: any[] = [];
    console.log('inside creation');
    if (data.backgroundImage) {
        media = data.backgroundImage.map((media) => {
            return IpfsConnector.getInstance().api.add(Buffer.from(media.src));
        });
    }
    if (data.avatar) {
        media.push(
            IpfsConnector.getInstance()
                .api
                .add(Buffer.from(data.avatar))
        );
    }
    return Promise.all(media)
        .then((hashes) => {
            console.log('inside all creation');
            hashes.forEach((v: string, i: number) => {
                if (i === (hashes.length - 1)) {
                    returned.avatar = v;
                } else {
                    returned.backgroundImage[i].src = v;
                }
            });
            console.log('ipfs object', returned);
            return IpfsConnector.getInstance().api.add(returned);
        });
};

/**
 *
 * @param hash
 * @returns {any}
 */
const getShortProfile = (hash: string) => {
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
            return Promise.resolve(resolved);
        });
};

/**
 *
 * @param hash
 * @returns {Bluebird<U>|Thenable<U>|Promise<TResult>|PromiseLike<TResult>}
 */
const resolveProfile = (hash: string) => {
    return getShortProfile(hash)
        .then((schema: ProfileModel) => {
            let resolved: any = Object.assign({}, schema);
            const LINKS: any[] = [];
            if (schema.backgroundImage) {
                schema.backgroundImage.forEach((media) => {
                    LINKS.push(IpfsConnector.getInstance().api.resolve(media.src));
                });
            }
            return Promise.all(LINKS)
                .then((sources: Buffer[]) => {
                    sources.forEach((val, i) => {
                        resolved.backgroundImage[i].src = Uint8Array.from(val);
                    });
                    return resolved;
                });
        });
};

/**
 *
 * @returns {{create: ((data:IpfsProfileCreateRequest)=>(Bluebird<U>|Thenable<U>|Promise<TResult>|PromiseLike<TResult>)), getShortProfile: ((hash:string)=>any), resolveProfile: ((hash:string)=>(Bluebird<U>|Thenable<U>|Promise<TResult>|PromiseLike<TResult>))}}
 */
export default function init() {
    return {
        create,
        getShortProfile,
        resolveProfile
    };
}
