"use strict";
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const records_1 = require('./records');
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
        return this;
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
        if (records_1.entries.records.getShort(this.hash)) {
            return Promise.resolve(records_1.entries.records.getShort(this.hash));
        }
        return ipfs_connector_1.IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
            records_1.entries.records.setShort(this.hash, data);
            return data;
        });
    }
    getFullContent() {
        if (records_1.entries.records.getFull(this.hash)) {
            return Promise.resolve(records_1.entries.records.getFull(this.hash));
        }
        return ipfs_connector_1.IpfsConnector.getInstance().api
            .get(this.hash)
            .then((data) => {
            records_1.entries.records.setFull(this.hash, data);
            return data;
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Entry;
//# sourceMappingURL=Entry.js.map