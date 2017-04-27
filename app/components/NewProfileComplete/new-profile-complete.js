import React from 'react';
import PropTypes from 'prop-types';
import PanelContainerFooter from '../PanelContainer/panel-container-footer';
import RaisedButton from 'material-ui/RaisedButton';

const NewProfileComplete = (props) => {
    const { history, tempProfileDelete, tempProfile } = this.props;
    return (
      <div>
          DONE!
        <PanelContainerFooter>
          <RaisedButton label="Enjoy AKASHA" />
        </PanelContainerFooter>
      </div>
    );
};

NewProfileComplete.propTypes = {
    history: PropTypes.shape(),
    tempProfile: PropTypes.shape(),
    tempProfileDelete: PropTypes.func,
}

export default NewProfileComplete;
