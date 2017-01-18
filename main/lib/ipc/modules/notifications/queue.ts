// wip
class Notifications {
    public queue = [];
    private COLLECT_TIME = 5000;
    private DELIVER_INTERVAL = 1000;

    public push(notification: any){
        this.queue.push(notification);
    }
}
