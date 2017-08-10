import React from 'react';
import { ClaimRunner, CommentsPublisher, CommonRunner, FollowRunner, ProfileUpdater,
    PublishEntryRunner, TagRunner, TipRunner, VoteRunner } from './';

const Runners = () => (
  <div>
    {/* <ClaimRunner />
    <CommentsPublisher /> */}
    <CommonRunner />
    <FollowRunner />
    {/* <ProfileUpdater /> */}
    {/* <PublishEntryRunner />
    <TagRunner /> */}
    <TipRunner /> 
    <VoteRunner />
  </div>
);

export default Runners;
