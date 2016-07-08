import React from 'react';
import { Paper } from 'material-ui';

class PublishPanel extends React.Component {
    render () {
        return (
          <Paper style={{ width: (this.props.width || 640), zIndex: 10, height: '100%' }}>
            <div>Publish a New Entry</div>
          </Paper>
        );
    }
}

export default PublishPanel;
