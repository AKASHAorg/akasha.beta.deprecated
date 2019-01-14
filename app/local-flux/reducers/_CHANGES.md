
#### january/2019
    - reducer handlers refactor

#### january/2019
    - merged utils state with app state
    - moved create-reducer utility method to ./utils
    - added a first iteration of request state (more docs in future changelogs)

#### december/2018
    - remove records an add state-models
      State models extends Immutable.Record and adds helper (mostly setter) methods, leaving reducers and reducer handlers as clean as possible and increasing readability.

#### december/2018
    - merged tempProfileState with profileState

#### nov/2018
Removed following flags (commented but not deleted):
    - ActionState (flags, needAuth, needEth, needAeth, needMana)
    - AppState (appReady, homeReady)
    - CommentState (flags, profileComments.fetchingMoreComments, profileComments.fetchingComments, )
    - DashboardState (flags, columnRecord.flags)
    - EntryState (flags, fetchingEntriesCount, profileEntries.fetchingEntries, profileEntries.fetchingMoreEntries)
    - ExternalProcessState (ipfsRecord.flags, gethRecord.flags)
    - ListState (flags)
    - NotificationsState (fetchingNotifications, notificationsLoaded). Removed unreadNotifications logic
    - ProfileState (flags, fetchingFullLoggedProfile)
    - SettingsState - remove handlers for USER_SETTINGS_CLEAR, USER_SETTINGS_REQUEST, CLEAN_STORE.
    - TagState (flags)