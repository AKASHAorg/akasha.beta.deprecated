import { connect } from 'react-redux';
import { ChatActions } from 'local-flux';
import ChatPage from './components/chat-page';
import { getInitials } from 'utils/dataModule';

function mapStateToProps (state) {
    const loggedProfileData = state.profileState.get('profiles').find(prf =>
        prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile']));
    const loggedProfileInitials =
        getInitials(loggedProfileData.get('firstName'), loggedProfileData.get('lastName'));
    return {
        activeChannel: state.chatState.get('activeChannel'),
        joinedChannels: state.chatState.get('joinedChannels'),
        loggedProfileAddress: loggedProfileData.get('profile'),
        loggedProfileAkashaId: loggedProfileData.get('akashaId'),
        loggedProfileAvatar: loggedProfileData.get('avatar'),
        loggedProfileInitials,
        recentChannels: state.chatState.get('recentChannels'),
        shouldNavigateToChannel: state.chatState.getIn(['flags', 'shouldNavigateToChannel']),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        chatActions: new ChatActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
