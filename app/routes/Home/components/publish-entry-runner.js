import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProfileActions, DraftActions, AppActions } from 'local-flux';
/**
 * This component will publish entries in parallel
 * main logic of entry publishing steps will be here
 * @TODO: Create some kind of queue and a task runner to be used for profile creation too
 *
 */
class PublishEntryRunner extends Component {
    componentWillReceiveProps (nextProps) {
        const { drafts, params, loggedProfile, loggedProfileData } = nextProps;

        const publishableDrafts = drafts.filter(draft =>
            draft.status.publishing && draft.status.publishingConfirmed);
        publishableDrafts.forEach((draft) => {
            console.log('resume publishing for', draft);
        });
    }
    render () {
        return null;
    }
}

PublishEntryRunner.propTypes = {
    drafts: React.PropTypes.shape(),
    params: React.PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        drafts: state.draftState.get('drafts'),
        tagState: state.tagState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        draftActions: new DraftActions(dispatch),
        appActions: new AppActions(dispatch),

    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryRunner);
