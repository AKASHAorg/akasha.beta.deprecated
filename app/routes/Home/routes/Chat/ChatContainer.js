import { connect } from 'react-redux';
import ChatPage from './components/ChatPage';
import { getInitials } from 'utils/dataModule';

function mapStateToProps (state) {
    const loggedProfileData = state.profileState.get('profiles').find(prf =>
        prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile']));
    const loggedProfileInitials =
        getInitials(loggedProfileData.get('firstName'), loggedProfileData.get('lastName'));
    return {
        loggedProfileAddress: loggedProfileData.get('profile'),
        loggedProfileAkashaId: loggedProfileData.get('akashaId'),
        loggedProfileAvatar: loggedProfileData.get('avatar'),
        loggedProfileInitials
    };
}

function mapDispatchToProps () {

}

export default connect(mapStateToProps)(ChatPage);
