import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProfileActions, EntryActions } from 'local-flux';
import AddEntryPage from '../shared-components/entry/add-entry-page';

class NewEntryPage extends Component {
    componentWillMount () {}
    render () {
        return (
          <AddEntryPage {...this.props} />
        );
    }
}
NewEntryPage.propTypes = {
    params: React.PropTypes.object,
    entryActions: React.PropTypes.object
};
function mapStateToProps (state) {
    return {
        profileState: state.profileState,
        entryState: state.entryState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEntryPage);
