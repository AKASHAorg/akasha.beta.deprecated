import React from 'react';
import PropTypes from 'prop-types';
import styles from './panel-loader.scss';
import ProfileDetailsPanel from '../panels/user-profile-details';
import ProfileEditPanel from '../panels/profile-edit';

const getMatchingPanel = (panels, location) => {
    if (location.pathname.includes('/panel/')) {
        // we must have a matching panel. find it!
        const pathParts = location.pathname.split('/');
        const panelName = pathParts[pathParts.length - 1];
        return panels[panelName];
    }
    return null;
};

const PanelLoader = (props) => {
    const panels = {
        uprofile: <ProfileDetailsPanel {...props} />,
        editProfile: <ProfileEditPanel {...props} />
    };
    const { location } = props;
    const panel = getMatchingPanel(panels, location);
    return (
      <div className={`${styles.root} col-xs-12`}>
        {panel}
      </div>
    );
};

PanelLoader.propTypes = {
    location: PropTypes.shape()
};

export default PanelLoader;
