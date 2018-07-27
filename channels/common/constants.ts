export const CORE_MODULE = Object.freeze({
  VALIDATOR_SCHEMA: 'VALIDATOR_SCHEMA',
  WEB3_HELPER: 'WEB3_HELPER',
  WEB3_API: 'WEB3_API',
  IPFS_API: 'IPFS_API',
  IPFS_PROVIDER: 'IPFS_PROVIDER',
  CONTRACTS: 'CONTRACTS',
  STASH: 'STASH',
  DB_INDEX: 'DB_INDEX',
  IPFS_CONNECTOR: 'IPFS_CONNECTOR',
  GETH_CONNECTOR: 'GETH_CONNECTOR',
  SETTINGS: 'settings',
  AUTH: 'AUTH',
  RESPONSES: 'RESPONSES',
});

export const AUTH_MODULE = Object.freeze({
  auth: 'auth_AUTH',
  generateEthKey: 'generateEthKey_AUTH',
  getLocalIdentities: 'getLocalIdentities_AUTH',
  login: 'login_AUTH',
  logout: 'logout_AUTH',
  regenSession: 'regenSession_AUTH',
  requestEther: 'requestEther_AUTH',
});

export const TX_MODULE = Object.freeze({
  addToQueue: 'addToQueue',
  emitMined: 'emitMined',
  getTransaction: 'getTransaction',
});

export const TAGS_MODULE = Object.freeze({
  canCreate: 'canCreateTag',
  checkFormat: 'checkTagFormat',
  createTag: 'createTag',
  existsTag: 'existsTag',
  fetchTags: 'fetchTags',
  tagCount: 'tagCount',
  tagIterator: 'tagIterator',
  searchTag: 'searchTag',
  syncTags: 'syncTags',
});

export const SEARCH_MODULE = Object.freeze({
  query: 'query_SEARCH',
  flush: 'flush_SEARCH',
  findTags: 'findTags_SEARCH',
  findProfiles: 'findProfiles_SEARCH',
});

export const COMMON_MODULE = Object.freeze({
  profileHelpers: 'profile_common_helpers',
  ipfsHelpers: 'ipfs_common_helpers',

});

export const REGISTRY_MODULE = Object.freeze({
  addressOf: 'addressOf_R',
  checkIdFormat: 'checkIdFormat_R',
  fetchRegistered: 'fetchRegistered_R',
  profileExists: 'profileExists_R',
  registerProfile: 'registerProfile_R',

});

export const PINNER_MODULE = Object.freeze({
  pin: 'pin_P',
});

export const NOTIFICATIONS_MODULE = Object.freeze({
  entriesCache: 'entriesCache_No',
  queue: 'queue_No',
  comments: 'comments_No',
  donations: 'donations_No',
  excludeFilter: 'excludeFilter_No',
  includeFilter: 'includeFilter_No',
  feed: 'feed_No',
  setFilter: 'setFilter_No',
  votes: 'votes_No',
  subscribe: 'subscribe_No',
});

export const LICENCE_MODULE = Object.freeze({
  getLicenceById: 'getLicenceById_Li',
  getLicences: 'getLicences_Li',
});

export const IPFS_MODULE = Object.freeze({
  createImage: 'createImage_ip',
  getConfig: 'getConfig_ip',
  getPorts: 'getPorts_ip',
  logs: 'logs_ip',
  resolve: 'resolve_ip',
  setPorts: 'setPorts_ip',
  startService: 'startService_ip',
  status: 'status_ip',
  stopService: 'stopService_ip',
});

export const GETH_MODULE = Object.freeze({
  options: 'options_geth',
  stop: 'stop_geth',
  start: 'start_geth',
  restartService: 'restartService_geth',
  startService: 'startService_geth',
  status: 'status_geth',
  syncStatus: 'syncStatus_geth',
  logs: 'logs_geth',
});

export const PROFILE_MODULE = Object.freeze({
  getByAddress: 'getByAddress_P',
  profileData: 'profileData_P',
  resolveEthAddress: 'resolveEthAddress_P',
  followingCount: 'followingCount_P',
  followersCount: 'followersCount_P',
  entryCountProfile: 'entryCountProfile_P',
  resolveProfile: 'resolveProfile_P',
  getShortProfile: 'getShortProfile_P',
  getCurrentProfile: 'getCurrentProfile_P',
  getBalance: 'getBalance_P',
  getCommentsCount: 'getCommentsCount_P',
  commentsIterator: 'commentsIterator_P',
  followProfile: 'followProfile_P',
  unFollowProfile: 'unFollowProfile_P',
  updateProfileData: 'updateProfileData_P',
  followersIterator: 'followersIterator_P',
  followingIterator: 'followingIterator_P',
  isFollower: 'isFollower_P',
  getProfileList: 'getProfileList_P',
  sendTip: 'tip_P',
  resolveProfileIpfsHash: 'resolveProfileIpfsHash_P',
  toggleDonations: 'toggleDonations_P',
  bondAeth: 'bondAeth_P',
  cycleAeth: 'cycleAeth_P',
  freeAeth: 'freeAeth_P',
  transformEssence: 'transformEssence_P',
  manaBurned: 'manaBurned_P',
  cyclingStates: 'cyclingStates_P',
  transfer: 'transfer_P',
  transfersIterator: 'transfersIterator_P',
  essenceIterator: 'essenceIterator_P',
  votesIterator: 'votesIterator_P',
  karmaRanking: 'karmaRanking_P',
});

export const GENERAL_SETTINGS = Object.freeze({
  OP_WAIT_TIME: 'OP_WAIT_TIME',
  BASE_URL: 'BASE_URL',
  FULL_WAIT_TIME: 'FULL_WAIT_TIME',
  IPFS_DEFAULT_PATH: 'IPFS_DEFAULT_PATH',
  FAUCET_URL: 'FAUCET_URL',
  FAUCET_TOKEN: 'FAUCET_TOKEN',
});

export const PROFILE_CONSTANTS = Object.freeze({
  AVATAR: 'avatar',
  LINKS: 'links',
  ABOUT: 'about',
  BACKGROUND_IMAGE: 'backgroundImage',
});

export const PROFILE_SCHEMA = Object.freeze({
  id: '/profileSchema',
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    avatar: { type: 'any' },
    backgroundImage: {
      type: 'object',
      properties: {
        xs: { $ref: '/imgSize' },
        sm: { $ref: '/imgSize' },
        md: { $ref: '/imgSize' },
        lg: { $ref: '/imgSize' },
        xl: { $ref: '/imgSize' },
      },
    },
    about: { type: 'string' },
    links: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          url: { type: 'string' },
          type: { type: 'string' },
          id: { type: 'number' },
        },
        required: ['title', 'url', 'type', 'id'],
      },
      uniqueItems: true,
    },
  },
});

export const IMG_SIZE_SCHEMA = Object.freeze({
  id: '/imgSize',
  type: 'object',
  properties: {
    src: { type: 'any' },
    width: { type: 'number' },
    height: { type: 'number' },
  },
  required: ['src', 'width', 'height'],
});

export const ENTRY_MODULE = Object.freeze({
  helpers: 'helpers_entry',
  allStreamIterator: 'allStreamIterator_entry',
  buildFilter: 'buildFilter_entry',
  canClaim: 'canClaim_entry',
  canClaimVote: 'canClaimVote_entry',
  claim: 'claim_entry',
  claimVote: 'claimVote_entry',
  downVote: 'downVote_entry',
  editEntry: 'editEntry_entry',
  ipfsEntryHelper: 'ipfsEntryHelper_entry',
  getProfileEntriesCount: 'getProfileEntriesCount_entry',
  getTagEntriesCount: 'getTagEntriesCount_entry',
  entryProfileIterator: 'entryProfileIterator_entry',
  getScore: 'getScore_entry',
  entryTagIterator: 'entryTagIterator_entry',
  followingStreamIterator: 'followingStreamIterator_entry',
  ipfs: 'ipfs_entry',
  findAuthor: 'findAuthor_entry',
  getEntry: 'getEntry_entry',
  getEntryBalance: 'getEntryBalance_entry',
  getEntryIpfsHash: 'getEntryIpfsHash_entry',
  getEntryList: 'getEntryList_entry',
  getLatestEntryVersion: 'getLatestEntryVersion_entry',
  getVoteOf: 'getVoteOf_entry',
  myVotesIterator: 'myVotesIterator_entry',
  publish: 'publish_entry',
  resolveEntriesIpfsHash: 'resolveEntriesIpfsHash_entry',
  syncEntries: 'syncEntries_ENTRY',
  filterFromPublish: 'filterFromPublish_entry',
  indexDbEntry: 'indexDbEntry_entry',
  upVote: 'upVote_entry',
  voteCost: 'voteCost_ENTRY',
  getVoteEndPeriod: 'getVoteEndPeriod_ENTRY',
  getVoteRatio: 'getVoteRatio_entry',
  votesIterator: 'votesIterator_entry',
});

export const COMMENTS_MODULE = Object.freeze({
  comment: 'comment_comments',
  commentsCount: 'commentsCount_comments',
  commentIpfs: 'commentIpfs_comments',
  downVote: 'downVote_comments',
  getComment: 'getComment_comments',
  commentsIterator: 'commentsIterator_comments',
  getScore: 'getScore_comments',
  removeComment: 'removeComment_comments',
  resolveCommentsIpfsHash: 'resolveCommentsIpfsHash',
  upvote: 'upvote_comments',
  getVoteOf: 'getVoteOf_comments',
});

export default {
  CORE_MODULE,
  AUTH_MODULE,
  TX_MODULE,
  TAGS_MODULE,
  SEARCH_MODULE,
  COMMON_MODULE,
  REGISTRY_MODULE,
  PINNER_MODULE,
  NOTIFICATIONS_MODULE,
  LICENCE_MODULE,
  IPFS_MODULE,
  GETH_MODULE,
  PROFILE_MODULE,
  GENERAL_SETTINGS,
  PROFILE_CONSTANTS,
  PROFILE_SCHEMA,
  IMG_SIZE_SCHEMA,
  ENTRY_MODULE,
  COMMENTS_MODULE,
};
