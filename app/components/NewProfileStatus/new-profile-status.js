import React, { PureComponent, PropTypes } from 'react';

class NewProfileStatus extends PureComponent {
    _getStatusText = () => {
        const { tempProfileStatus, akashaId } = this.props;
        console.log(tempProfileStatus, akashaId, 'tempProfileStatus');
    }
    render () {
        return (
          <div>
            {this._getStatusText()}
          </div>
        );
    }
}
NewProfileStatus.propTypes = {
    tempProfileStatus: PropTypes.shape().isRequired,
    akashaId: PropTypes.string.isRequired,
};

export default NewProfileStatus;
