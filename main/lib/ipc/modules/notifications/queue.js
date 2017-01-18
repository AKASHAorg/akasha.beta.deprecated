class Notifications {
    constructor() {
        this.queue = [];
        this.COLLECT_TIME = 5000;
        this.DELIVER_INTERVAL = 1000;
    }
    push(notification) {
        this.queue.push(notification);
    }
}
//# sourceMappingURL=queue.js.map