import React, { Component } from 'react';
import { EntryActions } from 'local-flux';
import { connect } from 'react-redux';

class StreamPage extends Component {
    render () {
        return (
            <div>Stream Page</div>
        );
    }
}

StreamPage.propTypes = {
    entryActions: React.PropTypes.object
};

function mapStateToProps (state) {
    return {
        entryState: state.entryState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        entryActions: new EntryActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StreamPage);
