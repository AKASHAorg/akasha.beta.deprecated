import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styles from './panels.scss';
import ListPanel from './list-panel';
import ProfileDetailsPanel from './user-profile-details';
import ProfileEditPanel from './profile-edit';
import UserSettingsPanel from './user-settings-panel';
import UserWalletPanel from './user-wallet-panel';

const Panels = () => (
  <div className={`${styles.root} col-xs-12`}>
    <Switch>
      <Route
        component={ProfileDetailsPanel}
        exact
        path="/:rootPath*/panel/uprofile"
      />
      <Route
        component={ProfileEditPanel}
        exact
        path="/:rootPath*/panel/editProfile"
      />
      <Route
        component={UserSettingsPanel}
        exact
        path="/:rootPath*/panel/settings"
      />
      <Route
        component={UserWalletPanel}
        exact
        path="/:rootPath*/panel/wallet"
      />
      <Route
        component={ListPanel}
        exact
        path="/:rootPath*/panel/lists"
      />
      <Route
        path="/:rootPath*/panel/lists/:listName?"
        render={
          routeProps =>
            <div>A list {routeProps.match.params.listName}</div>
        }
      />
    </Switch>
  </div>
);

export default Panels;
