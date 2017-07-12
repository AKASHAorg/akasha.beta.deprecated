import React from 'react';
import PropTypes from 'prop-types';
import Route from 'react-router-dom/Route';
import styles from './panels.scss';
import ProfileDetailsPanel from './user-profile-details';
import ProfileEditPanel from './profile-edit';
import UserSettingsPanel from './user-settings-panel';
import UserWalletPanel from './user-wallet-panel';

const renderComponent = (Component, props) => {
    return otherProps => <Component {...props} {...otherProps} />;
};

const Panels = props =>
    <div className={`${styles.root} col-xs-12`}>
        <Route exact path="/:rootPath*/panel/uprofile" render={renderComponent(ProfileDetailsPanel, { onPanelNavigate: props.onPanelNavigate })} />
        <Route exact path="/:rootPath*/panel/editProfile" component={renderComponent(ProfileEditPanel, { onPanelNavigate: props.onPanelNavigate })} />
        <Route exact path="/:rootPath*/panel/settings" render={renderComponent(UserSettingsPanel, { onPanelNavigate: props.onPanelNavigate })} />
        <Route exact path="/:rootPath*/panel/wallet" render={renderComponent(UserWalletPanel, { onPanelNavigate: props.onPanelNavigate })} />
        <Route
            path="/:rootPath*/panel/lists/:listName?"
            render={
                (routeProps) => {
                    console.log('list', routeProps);
                    return <div>A list {routeProps.match.params.listName}</div>;
                }
            }
        />
    </div>
Panels.propTypes = {
    onPanelNavigate: PropTypes.func,
};

export default Panels;
