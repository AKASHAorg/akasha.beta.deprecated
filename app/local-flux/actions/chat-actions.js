import { AppActions } from './';
import { chatActionCreators } from './action-creators';
import { ChatService } from '../services';

let chatActions = null;

class ChatActions {
    constructor (dispatch) { // eslint-disable-line consistent-return
        if (chatActions) {
            return chatActions;
        }
        this.dispatch = dispatch;
        this.chatService = new ChatService();
        this.appActions = new AppActions(dispatch);
        chatActions = this;
    }

    getJoinedChannels = akashaId =>
        this.chatService.getJoinedChannels({
            akashaId,
            onSuccess: data => this.dispatch(chatActionCreators.getJoinedChannelsSuccess(data)),
            onError: error => this.dispatch(chatActionCreators.getJoinedChannelsError(error))
        });

    getRecentChannels = akashaId =>
        this.chatService.getRecentChannels({
            akashaId,
            onSuccess: data => this.dispatch(chatActionCreators.getRecentChannelsSuccess(data)),
            onError: error => this.dispatch(chatActionCreators.getRecentChannelsError(error))
        });

    saveChannel = (channel) => {
        this.joinChannels([channel]);
        this.dispatch((dispatch, getState) => {
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.chatService.saveChannel({
                loggedAkashaId,
                channel,
                onSuccess: (data) => {
                    this.appActions.showNotification({
                        id: 'channelStarred',
                        values: { channel: data },
                        duration: 2000
                    });
                    dispatch(chatActionCreators.saveChannelSuccess(data));
                },
                onError: error => dispatch(chatActionCreators.saveChannelError(error))
            });
        });
    };

    deleteChannel = (channel) => {
        // this.leaveChannels([channel]);
        this.dispatch((dispatch, getState) => {
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.chatService.deleteChannel({
                loggedAkashaId,
                channel,
                onSuccess: data => this.dispatch(chatActionCreators.deleteChannelSuccess(data)),
                onError: error => this.dispatch(chatActionCreators.deleteChannelError(error))
            });
        });
    };

    saveRecentChannel = (channel) => {
        this.joinChannels([channel]);
        this.dispatch((dispatch, getState) => {
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.chatService.saveRecentChannel({
                loggedAkashaId,
                channel,
                onSuccess: data =>
                    this.dispatch(chatActionCreators.saveRecentChannelSuccess(data, {
                        shouldNavigateToChannel: true
                    })),
                onError: error => this.dispatch(chatActionCreators.saveRecentChannelError(error))
            });
        });
    };

    deleteRecentChannel = channel =>
        this.dispatch((dispatch, getState) => {
            const loggedAkashaId = getState().profileState.getIn(['loggedProfile', 'akashaId']);
            this.chatService.deleteRecentChannel({
                loggedAkashaId,
                channel,
                onSuccess: data =>
                    this.dispatch(chatActionCreators.deleteRecentChannelSuccess(data)),
                onError: error => this.dispatch(chatActionCreators.deleteRecentChannelError(error))
            });
        });

    joinChannels = (channels) => {
        this.chatService.joinChannels({ channels });
    };

    leaveChannels = (channels) => {
        this.chatService.leaveChannels({ channels });
    };

    getCurrentChannels = () => {
        this.chatService.getCurrentChannels({
            onSuccess: data => this.dispatch(chatActionCreators.getCurrentChannelsSuccess(data)),
            onError: error => this.dispatch(chatActionCreators.getCurrentChannelsError(error))
        });
    };

    setActiveChannel = channel =>
        this.dispatch(chatActionCreators.setActiveChannel(channel, {
            shouldNavigateToChannel: false
        }));
}

export { ChatActions };
