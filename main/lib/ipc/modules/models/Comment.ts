import { IpfsConnector } from '@akashaproject/ipfs-connector';
import { comments } from './records';

class Comment implements MediaComponent {
    hash: string;
    id: string;

    create(data: CommentModel) {
        const date  = (new Date()).toJSON();
        const constructed = {
            content: data.content,
            date,
            parent: data.parent
        };
        return IpfsConnector.getInstance().api
            .add(constructed)
            .then((hash: string) => {
                this.load(hash);
                return this.hash;
            })
    }

    load(hash: string) {
        this.hash = hash;
        return this;
    }

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
        if (comments.records.getShort(this.hash)) {
            return Promise.resolve(comments.records.getShort(this.hash));
        }
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
                comments.records.setShort(this.hash, data);
                return data;
            })
    }

    /**
     *
     * @returns {any}
     */
    getFullContent() {
        if (comments.records.getFull(this.hash)) {
            return Promise.resolve(comments.records.getFull(this.hash));
        }
        return IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
                comments.records.setFull(this.hash, data);
                return data;
            })
    }
}
export default Comment;
