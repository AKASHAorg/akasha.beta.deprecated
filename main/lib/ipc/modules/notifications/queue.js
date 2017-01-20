"use strict";
class Notifications {
    constructor() {
        this.queue = [];
        this.COLLECT_TIME = 3000;
        this.BATCH_SIZE = 3;
    }
    push(cb, notification) {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        if (notification && this.queue.indexOf(notification) === -1) {
            this.queue.push(notification);
        }
        this._timeout = setTimeout(() => {
            this.emit(cb);
        }, this.COLLECT_TIME);
    }
    emit(cb) {
        let count = (this.queue.length > this.BATCH_SIZE) ? this.BATCH_SIZE : this.queue.length;
        for (let i = 0; i < count; i++) {
            cb('', this.queue.shift());
        }
        if (this.queue.length) {
            this.push(cb);
        }
    }
    clear() {
        this.queue.length = 0;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new Notifications();
//# sourceMappingURL=queue.js.map