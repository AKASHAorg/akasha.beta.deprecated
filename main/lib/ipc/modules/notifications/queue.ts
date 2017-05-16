class Notifications {
    public queue = [];
    private _timeout;
    private COLLECT_TIME = 3000;
    private BATCH_SIZE = 3;

    public push(cb: any, notification?: any) {
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

    private emit(cb) {
        let count = (this.queue.length > this.BATCH_SIZE) ? this.BATCH_SIZE : this.queue.length;
        for (let i = 0; i < count; i++) {
            cb('', this.queue.shift());
        }
        if (this.queue.length) {
            this.push(cb);
        }
    }

    public clear() {
        clearTimeout(this._timeout);
        this.queue.length = 0;
    }
}
export default new Notifications();
