import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProfileActions, AppActions, EntryActions } from '../actions';
import AddEntryPage from '../components/entry/add-entry-page';

class NewEntryPage extends Component {
    render () {
        return (
          <AddEntryPage {...this.props} />
        );
    }
}
function mapStateToProps (state) {
    return {
        profileState: state.profileState,
        entryStateL: state.entryState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEntryPage);
