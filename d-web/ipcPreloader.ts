import { Subject } from 'rxjs/Subject';

export class GenericApi {
    public channel: string;
    public channelName: string;

    constructor(channel: string, channelName?: string) {
        this.channel = channel;
        this.channelName = channelName;
    }

}

export class ApiListener extends GenericApi {
    public pipe: Subject<any>;
    public subscribers = new Map();

    constructor(channel: string, channelName?: string) {
        super(channel, channelName);
        this.pipe = new Subject();
    }

    public send(data: {}) {
        return this.pipe.next(data);
    }

    public on(listener) {
        this.subscribers.set(listener, this.pipe.subscribe({ next: data => listener(data) }));
    }

    public once(listener) {
        let sub = this.pipe.subscribe({
            next: (data) => {
                listener(data);
                sub.unsubscribe();
            }
        });
    }

    public removeListener(listener) {
        this.subscribers.get(listener).unsubscribe();
        this.subscribers.delete(listener);
    }

    public removeAllListeners() {
        for (let [listener] of this.subscribers) {
            this.removeListener(listener);
        }
        this.pipe.unsubscribe();
        this.subscribers.clear();
    }

    get listenerCount() {
        return this.subscribers.size;
    }
}

export class ApiRequest extends ApiListener {
    private listener: (data) => {};

    constructor(channel: string, channelName?: string) {
        super(channel, channelName);
    }

    public enable() {
        if (!this.listener) {
            throw new Error(`Must register a listener for ${this.channelName} first`);
        }
        if (this.listenerCount === 0) {
            this.on(this.listener);
        }
        return { listening: true };
    }

    public disable() {
        if (this.listenerCount !== 0) {
            this.removeListener(this.listener);
        }
        return { listening: false };
    }

    public registerListener(listener: (data) => {}) {
        this.listener = listener;
    }
}
