import { contains, uniq } from 'ramda';
import { NOTIFICATIONS_MODULE } from '@akashaproject/common/constants';
export default function init(sp, getService) {
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
            if (notification && !contains(notification, this.queue)) {
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
            this.queue = uniq(this.queue);
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
    sp().service(NOTIFICATIONS_MODULE.queue, service);
    return queue;
}
//# sourceMappingURL=queue.js.map