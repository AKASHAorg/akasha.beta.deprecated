import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
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
import HomeContainer from './routes/Home/HomeContainer';
import NewEntryContainer from './routes/Home/routes/NewEntry/NewEntryContainer';
import PublishEntryPanelContainer from './routes/Home/routes/NewEntry/routes/PublishEntry/PublishEntryPanelContainer';
import PublishEntryStatusContainer from './routes/Home/routes/NewEntry/routes/PublishEntryStatus/PublishEntryStatusContainer';
import PublishEntryCompleteContainer from './routes/Home/routes/NewEntry/routes/PublishEntryComplete/PublishEntryCompleteContainer';
import StreamPageContainer from './routes/Home/routes/Stream/StreamContainer';
import EntryListContainer from './routes/Home/routes/Stream/routes/EntryList/EntryListContainer';
import PeoplePageContainer from './routes/Home/routes/People/PeopleContainer';
import ProfileDetailsContainer from './routes/Home/routes/People/routes/ProfileDetails/ProfileDetailsContainer';
import EntryPageContainer from './routes/Home/routes/Entry/EntryContainer';
import requireAuth from './require-auth';

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
    <Route component={requireAuth(HomeContainer)} path=":akashaId" >
      <IndexRedirect to="explore/tag" />

      {/** loads articles from blockchain */}
      <Route component={StreamPageContainer}>
        <Route component={EntryListContainer} path="explore(/:filter)" />
      </Route>

      {/** loads details about different profiles */}
      <Route component={PeoplePageContainer} path="people" />
      <Route component={ProfileDetailsContainer} path="profile/:profileAddress" />

      {/** create a new entry or edit existing one */}
      <Route component={NewEntryContainer} path="draft/:draftId" >

        {/** publish an entry */}
        <Route component={PublishEntryPanelContainer} path="publish" />

        {/** display status of the publishing step */}
        <Route component={PublishEntryStatusContainer} path="publish-status" />

        {/** display info about newly published entry */}
        <Route component={PublishEntryCompleteContainer} path="publish-complete" />
      </Route>
      {/** view entry page */}
      <Route component={EntryPageContainer} path=":entryId" />
    </Route>
  </Route>
);
