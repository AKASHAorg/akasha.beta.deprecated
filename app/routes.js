import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import requireAuth from './require-auth';

import AppContainer from './routes/AppContainer';
import AuthContainer from './routes/Login/routes/Authenticate/AuthContainer';
import ChatChannel from './routes/Home/routes/Chat/components/chat-channel';
import ChatContainer from './routes/Home/routes/Chat/ChatContainer';
import ConfigurationContainer from './routes/Setup/routes/Configuration/ConfigurationContainer';
import CreateProfileCompleteContainer from './routes/Login/routes/CreateProfileComplete/CreateProfileCompleteContainer';
import CreateProfileContainer from './routes/Login/routes/CreateProfile/CreateProfileContainer';
import CreateProfileStatusContainer from './routes/Login/routes/CreateProfileStatus/CreateProfileStatusContainer';
import EntryListContainer from './routes/Home/routes/Stream/routes/EntryList/EntryListContainer';
import EntryPageContainer from './routes/Home/routes/Entry/EntryContainer';
import HomeContainer from './routes/Home/HomeContainer';
import LoginLayout from './routes/Login/LoginLayout';
import NewEntryContainer from './routes/Home/routes/NewEntry/NewEntryContainer';
import PeoplePageContainer from './routes/Home/routes/People/PeopleContainer';
import ProfileDetailsContainer from './routes/Home/routes/People/routes/ProfileDetails/ProfileDetailsContainer';
import PublishEntryCompleteContainer from './routes/Home/routes/NewEntry/routes/PublishEntryComplete/PublishEntryCompleteContainer';
import PublishEntryPanelContainer from './routes/Home/routes/NewEntry/routes/PublishEntry/PublishEntryPanelContainer';
import PublishEntryStatusContainer from './routes/Home/routes/NewEntry/routes/PublishEntryStatus/PublishEntryStatusContainer';
import Setup from './routes/Setup/Setup';
import StreamPageContainer from './routes/Home/routes/Stream/StreamContainer';
import SynchronizationContainer from './routes/Setup/routes/Synchronization/SynchronizationContainer';

export default (
  <Route component={AppContainer} path="/" > {/** displays errors and various info */}
    <IndexRedirect to="setup" />
    <Route component={Setup} path="setup" >
      <IndexRoute component={ConfigurationContainer} />
      <Route component={SynchronizationContainer} path="sync-status" />
    </Route>
    <Route component={LoginLayout} path="authenticate">
      <IndexRoute component={AuthContainer} />
      <Route component={CreateProfileContainer} path="new-profile" />
      <Route component={CreateProfileStatusContainer} path="new-profile-status" />
      <Route component={CreateProfileCompleteContainer} path="new-profile-complete" />
    </Route>
    {/** <Route component={requireAuth(HomeContainer)} path=":akashaId" >
      <Route component={StreamPageContainer}>
        <Route component={EntryListContainer} path="explore(/:filter)(/:tag)" />
      </Route>
      <Route component={PeoplePageContainer} path="people" />
      <Route component={ProfileDetailsContainer} path="profile/:profileAddress" />
      <Route component={NewEntryContainer} path="draft/:draftId" >
        <Route component={PublishEntryPanelContainer} path="publish" />
        <Route component={PublishEntryStatusContainer} path="publish-status" />
        <Route component={PublishEntryCompleteContainer} path="publish-complete" />
      </Route>
      <Route component={EntryPageContainer} path="entry/:entryId" />
      <Route component={ChatContainer} path="chat">
        <IndexRoute component={ChatChannel} />
        <Route component={ChatChannel} path="channel(/:channel)" />
      </Route>
    </Route>*/}
  </Route>
);
