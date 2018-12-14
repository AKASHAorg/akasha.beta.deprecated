import { ApiListener } from '@akashaproject/core/ipcPreloader';
import { Observer, Subject, Subscription } from 'rxjs';

export default class DuplexChannel extends ApiListener {
  public subscribers: Map<Function, Subscription>;
  public subject: Subject<any>;
  public observer: Observer<any>;
  protected windowId;

  constructor(channel: string, opts?: { channelName?: string, windowId?: string }) {
    super(channel, opts.channelName);
    this.subject = new Subject();
    this.subscribers = new Map();
    this.windowId = opts.windowId;
  }

  public bind(observer: Observer<any>) {
    this.observer = observer;
  }

  get listenerCount() {
    return this.subject.observers.length || this.subscribers.size;
  }

  public on(listener: Function) {
    this.subscribers.set(
      listener,
      this.subject.subscribe((data: any) => listener(null, data), error => listener(error)),
    );
  }

  public once(listener: Function) {
    const sub = this.subject.subscribe(
      (data) => {
        listener(null, data);
        sub.unsubscribe();
      },
      (error) => {
        listener(error);
        sub.unsubscribe();
      },
    );
  }

  public removeListener(listener: Function) {
    this.subscribers.get(listener).unsubscribe();
    this.subscribers.delete(listener);
  }

  public removeAllListeners() {
    for (const [listener] of this.subscribers) {
      this.removeListener(listener);
    }
    this.pipe.unsubscribe();
    this.subscribers.clear();
  }

  public send(data: {}) {
    this.observer.next(data);
  }
}
