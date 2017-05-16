import LRU = require('lru-cache');

class Entries {

    public options = { max: 64, maxAge: 1000 * 60 * 60 };
    private FULL_PREFIX = 'F-';
    private SHORT_PREFIX = 'S-';
    private _entries;

    constructor() {
        this.loadOptions();
    }

    setOptions(newOptions: {}) {
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
export const entries = new Entries();
export const profiles = new Entries();
export const comments = new Entries();
export const mixed = new Entries();
mixed.setOptions({ max: 256, maxAge: 1000 * 60 * 15 });
