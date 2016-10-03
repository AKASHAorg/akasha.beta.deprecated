import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { entries } from './records';

class Entry implements MediaComponent {
    hash: string;
    id: string;

    /**
     *
     * @param content
     * @param tags
     * @returns {any}
     */
    create(content: any, tags: any[]) {
        const date  = (new Date()).toJSON();
        const constructed = {
            content,
            tags,
            date
        };
        return IpfsConnector.getInstance().api
            .add(constructed)
            .then((hash: string) => {
                this.load(hash);
                return this.hash;
            })
    }

    /**
     *
     * @param hash
     * @returns {Entry}
     */
    load(hash: string) {
        this.hash = hash;
        return this;
    }

    /**
     *
     * @returns {any}
     */
    read() {
        if (!this.hash) {
            return Promise.reject('Must set hash property first');
        }
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((content: JSON | Buffer) => content);
    }

    /**
     *
     * @param setData
     * @returns {any}
     */
    update(setData: any) {
        if (!this.hash) {
            return Promise.reject('Must set hash property first');
        }
        return IpfsConnector.getInstance().api
            .updateObject(this.hash, setData)
            .then((hash: string) => {
                this.load(hash);
                return this.hash;
            })
    }

    /**
     *
     * @returns {any}
     */
    getShortContent() {
        if (entries.records.getShort(this.hash)) {
            return Promise.resolve(entries.records.getShort(this.hash));
        }
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
                entries.records.setShort(this.hash, data);
                return data;
            })
    }

    /**
     *
     * @returns {any}
     */
    getFullContent() {
        if (entries.records.getFull(this.hash)) {
            return Promise.resolve(entries.records.getFull(this.hash));
        }
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
                entries.records.setFull(this.hash, data);
                return data;
            })
    }
}

export default Entry;
