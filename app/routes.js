import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AppContainer from './routes/AppContainer';
import BootAppContainer from './routes/BootApp/BootAppContainer';
import ChatChannel from './routes/Home/routes/Chat/components/chat-channel';
import ChatContainer from './routes/Home/routes/Chat/ChatContainer';
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

    <IndexRoute component={BootAppContainer} />
    <Route component={SetupContainer} path="setup" >
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
