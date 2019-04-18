import { ApiListener } from '@akashaproject/core/ipcPreloader';
import { Subject } from 'rxjs';
export default class DuplexChannel extends ApiListener {
    constructor(channel, opts) {
        super(channel, opts.channelName);
        this.subject = new Subject();
        this.subscribers = new Map();
        this.windowId = opts.windowId;
    }
    get listenerCount() {
        return this.subject.observers.length || this.subscribers.size;
    }
    bind(observer) {
        this.observer = observer;
    }
    on(listener) {
        this.subscribers.set(listener, this.subject.subscribe((data) => listener(null, data), error => listener(error)));
    }
    once(listener) {
        const sub = this.subject.subscribe((data) => {
            listener(null, data);
            sub.unsubscribe();
        }, (error) => {
            listener(error);
            sub.unsubscribe();
        });
    }
    removeListener(listener) {
        this.subscribers.get(listener).unsubscribe();
        this.subscribers.delete(listener);
    }
    removeAllListeners() {
        for (const [listener] of this.subscribers) {
            this.removeListener(listener);
        }
        this.pipe.unsubscribe();
        this.subscribers.clear();
    }
    send(data) {
        this.observer.next(data);
    }
}
//# sourceMappingURL=channel.js.map