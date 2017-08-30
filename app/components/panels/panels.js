import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HighlightEditPanel, HighlightsPanel, ListEntriesPanel, ListPanel, ProfileDetailsPanel,
    ProfileEditPanel, UserSettingsPanel, UserWalletPanel } from '../';

const Panels = () => (
  <div style={{ height: '100%' }}>
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
        component={HighlightsPanel}
        exact
        path="/:rootPath*/panel/highlights"
      />
      <Route
        component={HighlightEditPanel}
        path="/:rootPath*/panel/highlights/:highlightId?"
      />
      <Route
        component={ListPanel}
        exact
        path="/:rootPath*/panel/lists"
      />
      <Route
        component={ListEntriesPanel}
        path="/:rootPath*/panel/lists/:listName?"
      />
    </Switch>
  </div>
);

export default Panels;
