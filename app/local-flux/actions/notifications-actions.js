import { NotificationsService } from '../services';

let notificationsInstance;

class NotificationsActions {
    constructor (dispatch) {
        if (notificationsInstance) {
            return notificationsInstance;
        }
        this.dispatch = dispatch;
        // save only last 64 events
        this._notifPoll = new Array(64);
        this.emitEvent = false;
        this._watchers = new Map();
        this.notificationsService = new NotificationsService();
        notificationsInstance = this;
    }

    /**
     * Propagate event to bound listeners
     * @param notif
     * @private
     */
    _notifNew (notif) {
        if (this.emitEvent) {
            this._watchers.forEach((cb) => cb(notif))
        }
    }

    /**
     * Add extra bindings when receiving events
     * Ex: when on notifications page consume latest notification directly
     * @param name
     * @param cb
     */
    addWatcher (name, cb) {
        this._watchers.set(name, cb);
    }

    /**
     *
     * @param name
     */
    removeWatcher (name) {
        this._watchers.delete(name);
    }

    /**
     * Remove all extra bindings
     */
    flushWatchers () {
        this._watchers.clear();
    }

    /**
     * Just for special cases, use with caution
     */
    flushNotifications () {
        delete this._notifPoll;
        this._notifPoll = new Array(64);
    }

    /**
     * Remove last event and prepend newest
     * @param value
     * @private
     */
    _pushEvent (value) {
        this._notifPoll.pop();
        this._notifPoll.unshift(value);
        this._notifNew(value);
    }

    /**
     * Iterate over latest events
     * @returns {Array}
     */
    getEvents() {
        return this._notifPoll;
    }

    /**
     * Set profileAddresses[] to watch and block number outset
     * @param profiles
     * @param blockNr
     */
    setFilter (profiles, blockNr) {
        this.notificationsService.setFilter({
            profiles,
            blockNr,
            onSuccess: (data) => {
                // set that filter was saved
            }
        })
    }

    /**
     * Enable feed subscription
     */
    watchFeed() {
        this.notificationsService.listenFeed({
            onSuccess: (data) => {
                this._pushEvent(data);
            }
        })
    }

    /**
     * Stop subscription
     */
    stopFeed() {
        this.notificationsService.listenFeed({
            stop: true,
            onSuccess: () => {
                this.emitEvent = false;
            }
        })
    }
}

export { NotificationsActions };
