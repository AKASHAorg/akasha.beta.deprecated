import React from 'react';
import { Route } from 'react-router-dom';
import requireAuth from './require-auth';

import { AppContainer, ConfigurationContainer, SynchronizationContainer } from './containers';
import AuthContainer from './routes/Login/routes/Authenticate/AuthContainer';
import ChatChannel from './routes/Home/routes/Chat/components/chat-channel';
import ChatContainer from './routes/Home/routes/Chat/ChatContainer';
import CreateProfileCompleteContainer from './routes/Login/routes/CreateProfileComplete/CreateProfileCompleteContainer';
import CreateProfileContainer from './containers/create-profile-container';
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
import { Setup } from './components';
import StreamPageContainer from './routes/Home/routes/Stream/StreamContainer';

export default (
  <Route component={AppContainer} path="/" > {/** displays errors and various info */}
    {/**<IndexRedirect to="setup" />*/}
    <Route component={Setup} path="setup" >
      {/**<IndexRoute component={ConfigurationContainer} />*/}
      <Route component={SynchronizationContainer} path="sync-status" />
    </Route>
    <Route component={LoginLayout} path="authenticate">
      {/*<IndexRoute component={AuthContainer} />*/}
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
