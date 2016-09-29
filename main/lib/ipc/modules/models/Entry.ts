import { IpfsConnector } from '@akashaproject/ipfs-connector';

class Entry implements MediaComponent {
    hash: string;
    id: string;

    /**
     *
     * @param content
     * @param tags
     * @returns {any}
     */
    create(content:any, tags: any[]){
        const constructed = {
            content,
            tags
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
        if(!this.hash){
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
        if(!this.hash){
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
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
                return data;
            })
    }

    /**
     *
     * @returns {any}
     */
    getFullContent() {
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
                return data;
            })
    }
}

export default Entry;
