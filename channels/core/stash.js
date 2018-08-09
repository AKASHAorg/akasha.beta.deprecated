"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LRU = require("lru-cache");
const constants_1 = require("@akashaproject/common/constants");
function init(sp) {
    class Entries {
        constructor() {
            this.options = { max: 64, maxAge: 1000 * 60 * 60 };
            this.FULL_PREFIX = 'F-';
            this.SHORT_PREFIX = 'S-';
            this.loadOptions();
        }
        get records() {
            return this.entries;
        }
        setOptions(newOptions) {
            this.options = Object.assign({}, this.options, newOptions);
            return this;
        }
        loadOptions() {
            if (this.entries) {
                this.entries.reset();
            }
            this.entries = LRU(this.options);
        }
        setFull(hash, data) {
            this.entries.set(`${this.FULL_PREFIX}${hash}`, data);
        }
        getFull(hash) {
            return this.entries.get(`${this.FULL_PREFIX}${hash}`);
        }
        hasFull(hash) {
            return this.entries.has(`${this.FULL_PREFIX}${hash}`);
        }
        setShort(hash, data) {
            this.entries.set(`${this.SHORT_PREFIX}${hash}`, data);
        }
        getShort(hash) {
            return this.entries.get(`${this.SHORT_PREFIX}${hash}`);
        }
        hasShort(hash) {
            return this.entries.has(`${this.SHORT_PREFIX}${hash}`);
        }
        removeFull(hash) {
            this.entries.del(`${this.FULL_PREFIX}${hash}`);
        }
        removeShort(hash) {
            this.entries.del(`${this.SHORT_PREFIX}${hash}`);
        }
        flush() {
            this.entries.reset();
        }
    }
    const entries = new Entries();
    const profiles = new Entries();
    const comments = new Entries();
    const mixed = new Entries();
    const eventCache = new Entries();
    mixed.setOptions({ max: 1024, maxAge: 1000 * 60 * 15 });
    eventCache.setOptions({ max: 2048, maxAge: 1000 * 60 * 120 });
    const stash = { entries, profiles, comments, mixed, eventCache };
    const service = function () {
        return stash;
    };
    sp().service(constants_1.CORE_MODULE.STASH, service);
}
exports.default = init;
//# sourceMappingURL=stash.js.map