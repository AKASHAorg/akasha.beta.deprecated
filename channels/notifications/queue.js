"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    class Notifications {
        constructor() {
            this.queue = [];
            this.COLLECT_TIME = 3000;
            this.BATCH_SIZE = 3;
        }
        push(cb, notification) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            if (notification && !ramda_1.contains(notification, this.queue)) {
                this.queue.push(notification);
            }
            this.timeout = setTimeout(() => {
                this.emit(cb);
            }, this.COLLECT_TIME);
        }
        clear() {
            clearTimeout(this.timeout);
            this.queue.length = 0;
        }
        emit(cb) {
            this.queue = ramda_1.uniq(this.queue);
            const count = (this.queue.length > this.BATCH_SIZE) ?
                this.BATCH_SIZE : this.queue.length;
            for (let i = 0; i < count; i++) {
                cb('', this.queue.shift());
            }
            if (this.queue.length) {
                this.push(cb);
            }
        }
    }
    const queue = new Notifications();
    const service = function () {
        return queue;
    };
    sp().service(constants_1.NOTIFICATIONS_MODULE.queue, service);
    return queue;
}
exports.default = init;
//# sourceMappingURL=queue.js.map