"use strict";
const LRU = require('lru-cache');
class Entries {
    constructor() {
        this.options = { max: 64, maxAge: 1000 * 60 * 60 };
        this.FULL_PREFIX = 'F-';
        this.SHORT_PREFIX = 'S-';
        this.loadOptions();
    }
    setOptions(newOptions) {
        this.options = Object.assign({}, this.options, newOptions);
        return this;
    }
    loadOptions() {
        if (this._entries) {
            this._entries.reset();
        }
        this._entries = LRU(this.options);
    }
    setFull(hash, data) {
        this._entries.set(`${this.FULL_PREFIX}${hash}`, data);
    }
    getFull(hash) {
        return this._entries.get(`${this.FULL_PREFIX}${hash}`);
    }
    hasFull(hash) {
        return this._entries.has(`${this.FULL_PREFIX}${hash}`);
    }
    setShort(hash, data) {
        this._entries.set(`${this.SHORT_PREFIX}${hash}`, data);
    }
    getShort(hash) {
        return this._entries.get(`${this.SHORT_PREFIX}${hash}`);
    }
    hasShort(hash) {
        return this._entries.has(`${this.SHORT_PREFIX}${hash}`);
    }
    removeFull(hash) {
        this._entries.del(`${this.FULL_PREFIX}${hash}`);
    }
    removeShort(hash) {
        this._entries.del(`${this.SHORT_PREFIX}${hash}`);
    }
    flush() {
        this._entries.reset();
    }
    get records() {
        return this._entries;
    }
}
exports.entries = new Entries();
exports.profiles = new Entries();
exports.comments = new Entries();
exports.mixed = new Entries();
exports.mixed.setOptions({ max: 256, maxAge: 1000 * 60 * 30 });
//# sourceMappingURL=records.js.map