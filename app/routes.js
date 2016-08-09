import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AppContainer from './routes/AppContainer';
import BootAppContainer from './routes/BootApp/BootAppContainer';
import SetupContainer from './routes/Setup/SetupContainer';
import ConfigurationContainer from './routes/Setup/routes/Configuration/ConfigurationContainer';
import SynchronizationContainer from './routes/Setup/routes/Synchronization/SynchronizationContainer';
import LoginLayout from './routes/Login/LoginLayout';
import AuthContainer from './routes/Login/routes/Authenticate/AuthContainer';
import CreateProfileContainer from './routes/Login/routes/CreateProfile/CreateProfileContainer';
import CreateProfileStatusContainer from './routes/Login/routes/CreateProfileStatus/CreateProfileStatusContainer';
import CreateProfileCompleteContainer from './routes/Login/routes/CreateProfileComplete/CreateProfileCompleteContainer';
import HomeLayout from './routes/Home/HomeLayout';
import NewEntryContainer from './routes/Home/routes/NewEntry/NewEntryContainer';
import PublishEntryPanelContainer from './routes/Home/routes/NewEntry/routes/PublishEntry/PublishEntryPanelContainer';
import PublishEntryStatusContainer from './routes/Home/routes/NewEntry/routes/PublishEntryStatus/PublishEntryStatusContainer';
import PublishEntryCompleteContainer from './routes/Home/routes/NewEntry/routes/PublishEntryComplete/PublishEntryCompleteContainer';
import StreamPageContainer from './routes/Home/routes/Stream/StreamContainer';


export default (
  <Route component={AppContainer} path="/" > {/** displays errors and various info */}

    {/** checks for userSettings, if geth is running ... */}
    <IndexRoute component={BootAppContainer} />

    {/** checks if first start or geth/ipfs already configured*/}
    <Route component={SetupContainer} path="setup" >

      {/** configures geth and ipfs */}
      <IndexRoute component={ConfigurationContainer} />

      {/** syncs blockchain*/}
      <Route component={SynchronizationContainer} path="sync-status" />
    </Route>

    {/** check if user is logged in*/}
    <Route component={LoginLayout} path="authenticate">

      {/** shows local profiles and login */}
      <IndexRoute component={AuthContainer} />

      {/** form for profile creation */}
      <Route component={CreateProfileContainer} path="new-profile" />

      {/** display the status of profile creation */}
      <Route component={CreateProfileStatusContainer} path="new-profile-status" />

      {/** display info about profile on completion - error or success */}
      <Route component={CreateProfileCompleteContainer} path="new-profile-complete" />
    </Route>

    {/** user home after login */}
    <Route component={HomeLayout} path=":username" >

      {/** loads articles from blockchain */}
      <IndexRoute component={StreamPageContainer} />

      {/** create a new entry or edit existing one */}
      <Route component={NewEntryContainer} path="draft/:draftId" >

        {/** publish an entry */}
        <Route component={PublishEntryPanelContainer} path="publish" />

        {/** display status of the publishing step */}
        <Route component={PublishEntryStatusContainer} path="publish-status" />

        {/** display info about newly published entry */}
        <Route component={PublishEntryCompleteContainer} path="publish-complete" />
      </Route>
    </Route>
  </Route>
);
