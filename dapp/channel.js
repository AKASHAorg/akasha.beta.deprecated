'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const ipcPreloader_1 = require('@akashaproject/core/ipcPreloader');
const rxjs_1 = require('rxjs');

class DuplexChannel extends ipcPreloader_1.ApiListener {
  constructor(channel, opts) {
    super(channel, opts.channelName);
    this.subject = new rxjs_1.Subject();
    this.subscribers = new Map();
    this.windowId = opts.windowId;
  }

  bind(observer) {
    this.observer = observer;
  }

  get listenerCount() {
    return this.subject.observers.length || this.subscribers.size;
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

exports.default = DuplexChannel;
//# sourceMappingURL=channel.js.map