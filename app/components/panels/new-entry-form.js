import React, { Component, PropTypes } from 'react';
import { Paper } from 'material-ui';

class NewEntryFormPanel extends Component {
    render () {
        return (
          <Paper style={ this.props.rootStyle }>Having more than 1 entries or drafts..</Paper>
        );
    }
}
NewEntryFormPanel.propTypes = {
    maxWidth: PropTypes.string,
    rootStyle: PropTypes.object
};
NewEntryFormPanel.defaultProps = {
    rootStyle: {
        height: '100%',
        maxWidth: 640,
        zIndex: 10,
        position: 'relative'
    }
};
export default NewEntryFormPanel;
