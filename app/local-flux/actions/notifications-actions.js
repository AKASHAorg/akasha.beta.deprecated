import { NotificationsService } from '../services';
import * as action from './action-creators/notifications-action-creators';
let notificationsInstance;

class NotificationsActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (notificationsInstance) {
            return notificationsInstance;
        }
        this.dispatch = dispatch;
        this.emitEvent = false;
        this.currentProfile = null;
        this.notificationsService = new NotificationsService();
        notificationsInstance = this;
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
                console.log('engaging notifs!!');
            }
        })
    }

    /**
     * Enable feed subscription
     */
    watchFeed () {
        this.dispatch((dispatch, getState) => {
            this.currentProfile = getState().profileState.getIn(['loggedProfile', 'profile']);
                this.notificationsService.listenFeed({
                onSuccess: (data) => {
                    // if(getState().notificationsState.get())
                    if(data.profileAddress === this.currentProfile) {
                        return dispatch(action.receiveYouFeed(data));
                    }
                    return dispatch(action.receiveSubscriptionFeed(data));
                }
            })
        });
    }

    readFeedNotif() {
        this.dispatch(action.readSubscriptionFeed());
    }

    readYouNotif(number) {
        this.dispatch(action.readYouNotif(number));
    }

    /**
     * Stop subscription
     */
    stopFeed () {
        this.notificationsService.listenFeed({
            stop: true,
            onSuccess: () => {
                this.emitEvent = false;
            }
        })
    }
}

export { NotificationsActions };
