import { ProfileActions, SettingsActions } from 'local-flux';
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
        this.profileActions = new ProfileActions(dispatch);
        this.settingsActions = new SettingsActions(dispatch);
        notificationsInstance = this;
    }

    /**
     * Set profileAddresses[] to watch and block number outset
     * @param profiles
     * @param blockNr
     */
    setFilter (profiles, blockNr, exclude, newerThan) {
        this.notificationsService.setFilter({
            profiles,
            blockNr,
            exclude,
            onSuccess: () => {
                this.watchFeed({ newerThan });
            }
        });
    }

    /**
     * Enable feed subscription
     */
    watchFeed (options = { stop: false, newerThan: null }) {
        this.dispatch((dispatch, getState) => {
            this.emitEvent = true;
            this.currentProfile = getState().profileState.getIn(['loggedProfile', 'profile']);
            const timeStamp =
                getState().settingsState.getIn(['userSettings', 'latestMention']);
            const akashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.notificationsService.listenFeed({
                onSuccess: (data) => {
                    if (data.type === 'gotTipped') {
                        this.profileActions.getProfileBalance();
                    }
                    if (data.type === 'entryMention' && data.timeStamp > timeStamp) {
                        this.settingsActions.saveLatestMention(akashaId, data.timeStamp);
                    }
                    if (data.profileAddress === this.currentProfile || data.type === 'gotTipped' ||
                            data.type === 'entryMention') {
                        return dispatch(action.receiveYouFeed(data));
                    }
                    return dispatch(action.receiveSubscriptionFeed(data));
                },
                stop: options.stop,
                newerThan: options.newerThan
            });
        });
    }

    readFeedNotif = () => this.dispatch(action.readSubscriptionFeed());

    readYouNotif = number => this.dispatch(action.readYouNotif(number));

    deleteYouNotif = index => this.dispatch(action.deleteYouNotif(index));

    deleteFeedNotif = index => this.dispatch(action.deleteFeedNotif(index));

    sendMention = (mention, entryId, commentId) =>
        this.notificationsService.mention({
            mention,
            entryId,
            commentId,
            onSuccess: () => {},
            onError: () => {}
        });

    /**
     * Stop subscription
     */
    stopFeed () {
        this.notificationsService.listenFeed({
            stop: true,
            onSuccess: () => {
                this.emitEvent = false;
            }
        });
    }
}

export { NotificationsActions };
