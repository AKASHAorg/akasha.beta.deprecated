"use strict";
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
class Entry {
    create(content, tags) {
        const constructed = {
            content,
            tags
        };
        return ipfs_connector_1.IpfsConnector.getInstance().api
            .add(constructed)
            .then((hash) => {
            this.load(hash);
            return this.hash;
        });
    }
    load(hash) {
        this.hash = hash;
    }
    read() {
        if (!this.hash) {
            return Promise.reject('Must set hash property first');
        }
        return ipfs_connector_1.IpfsConnector.getInstance().api
            .get(this.hash)
            .then((content) => content);
    }
    update(setData) {
        if (!this.hash) {
            return Promise.reject('Must set hash property first');
        }
        return ipfs_connector_1.IpfsConnector.getInstance().api
            .updateObject(this.hash, setData)
            .then((hash) => {
            this.load(hash);
            return this.hash;
        });
    }
    getShortContent() {
        return Promise.resolve('abv');
    }
    getFullContent() {
        return Promise.resolve('afasfasfas');
    }
}
//# sourceMappingURL=Entry.js.map