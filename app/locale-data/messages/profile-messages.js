import { defineMessages } from 'react-intl';

export const profileMessages = defineMessages({
    createProfileTitle: {
        id: 'app.profileTitle',
        description: 'Modal title for new identity form',
        defaultMessage: 'Create new identity'
    },
    optionalDetailsLabel: {
        id: 'app.profile.optionalDetailsLabel',
        description: 'Label for optional details checkbox',
        defaultMessage: 'Optional details'
    },
    avatarTitle: {
        id: 'app.profile.avatarTitle',
        description: 'Avatar section title',
        defaultMessage: 'Avatar'
    },
    backgroundImageTitle: {
        id: 'app.profile.backgroundImageTitle',
        description: 'Background image section title',
        defaultMessage: 'Background image'
    },
    aboutMeTitle: {
        id: 'app.profile.aboutMeTitle',
        description: 'About Me section title',
        defaultMessage: 'About Me'
    },
    contacts: {
        id: 'app.profile.contacts',
        description: 'Contacts card title',
        defaultMessage: 'Contacts'
    },
    darkTheme: {
        id: 'app.profile.darkTheme',
        description: 'dark theme switch label',
        defaultMessage: 'Dark Theme'
    },
    shortDescriptionLabel: {
        id: 'app.profile.shortDescriptionLabel',
        description: 'Label for Short description text field',
        defaultMessage: 'Type something about you'
    },
    linksTitle: {
        id: 'app.profile.linksTitle',
        description: 'Links section title',
        defaultMessage: 'Links'
    },
    addLinkButtonTitle: {
        id: 'app.profile.addLinkButtontitle',
        description: 'text shown when hovering Add Link button',
        defaultMessage: 'add link'
    },
    removeLinkButtonTitle: {
        id: 'app.profile.removeLinkButtonTitle',
        description: 'text shown when hovering Remove Link button',
        defaultMessage: 'remove link'
    },
    cryptoAddresses: {
        id: 'app.profile.cryptoAddresses',
        description: 'crypto addresses section title',
        defaultMessage: 'Other crypto addresses'
    },
    addCryptoAddress: {
        id: 'app.profile.addCryptoAddress',
        description: 'add crypto address button label',
        defaultMessage: 'Add cryptocurrency address'
    },
    cryptoName: {
        id: 'app.profile.cryptoName',
        description: 'crypto name label',
        defaultMessage: 'Cryptocurrency Name'
    },
    cryptoAddress: {
        id: 'app.profile.cryptoAddress',
        description: 'crypto address label',
        defaultMessage: 'Cryptocurrency Address'
    },
    removeCryptoButtonTitle: {
        id: 'app.profile.removeCryptoButtonTitle',
        description: 'remove crypto button label',
        defaultMessage: 'Remove cryptocurrency link'
    },
    keepAccUnlockedLabel: {
        id: 'app.profile.keepAccUnlocked',
        description: 'Label for "Keep Account Unlocked For" checkbox',
        defaultMessage: 'Keep account unlocked for'
    },
    registeringIdentity: {
        id: 'app.profile.registeringIdentity',
        description: 'Registering identity status',
        defaultMessage: 'Registering identity'
    },
    yourIdentityIsBroadcasted: {
        id: 'app.profile.yourIdentityIsBroadcasted',
        description: 'describing that identity is broadcasted into network',
        defaultMessage: 'Your identity is broadcasted into the AKASHA private network.'
    },
    willTakeFewMoments: {
        id: 'app.profile.willTakeFewMinutes',
        description: 'action `will take a few moments` to complete',
        defaultMessage: 'This will take a few moments'
    },
    TEMP_PROFILE_CREATE: {
        id: 'app.profile.tempProfileCreate',
        description: 'creating a temp profile status message',
        defaultMessage: 'Creating a temporary profile'
    },
    TEMP_PROFILE_CREATE_SUCCESS: {
        id: 'app.profile.tempProfileCreateSuccess',
        description: 'a temporary profile was successfully saved to database',
        defaultMessage: 'Profile data saved to a local database'
    },
    ETH_ADDRESS_CREATE: {
        id: 'app.profile.ethAddressCreate',
        description: 'Message status when generating eth key',
        defaultMessage: 'Creating local Ethereum key'
    },
    ETH_ADDRESS_CREATE_SUCCESS: {
        id: 'app.profile.ethAddressCreateSuccess',
        description: 'Message status when eth key generated',
        defaultMessage: 'Ethereum key created'
    },
    FUND_FROM_FAUCET: {
        id: 'app.profile.fundFromFaucet',
        description: 'Message status when request to faucet started',
        defaultMessage: 'Requesting aethers from AKASHA'
    },
    FUND_FROM_FAUCET_SUCCESS: {
        id: 'app.profile.fundFromFaucetSuccess',
        description: 'Message status when faucet request accepted',
        defaultMessage: 'Request accepted.\nTransaction id is: {faucetTx}'
    },
    TEMP_PROFILE_FAUCET_TX_MINED: {
        id: 'app.profile.tempProfileFaucetTxMined',
        description: 'Message status when waiting for mined event',
        defaultMessage: 'Waiting for faucet transaction to be mined.'
    },
    TEMP_PROFILE_FAUCET_TX_MINED_SUCCESS: {
        id: 'app.profile.tempProfileFaucetTxMinedSuccess',
        description: 'Message status when tx mined',
        defaultMessage: 'Faucet Transaction successfully mined.'
    },
    TEMP_PROFILE_LOGIN: {
        id: 'app.profile.tempProfileLogin',
        description: 'Message status when login requested',
        defaultMessage: 'Logging in with @{akashaId}'
    },
    TEMP_PROFILE_LOGIN_SUCCESS: {
        id: 'app.profile.tempProfileLoginSuccess',
        description: 'Message status when login succeded',
        defaultMessage: 'Login was successful'
    },
    TEMP_PROFILE_PUBLISH: {
        id: 'app.profile.tempProfilePublish',
        description: 'Message status when publish profile requested',
        defaultMessage: 'Publishing your profile'
    },
    TEMP_PROFILE_PUBLISH_SUCCESS: {
        id: 'app.profile.tempProfilePublishSuccess',
        description: 'Message status when profile was published',
        defaultMessage: 'Profile published.\nTransaction id is: {publishTx}'
    },
    TEMP_PROFILE_PUBLISH_TX_MINED: {
        id: 'app.profile.tempProfilePublishTxMined',
        description: 'Message status when waiting for mined event for publish tx',
        defaultMessage: 'Waiting for publish transaction to be mined'
    },
    TEMP_PROFILE_PUBLISH_TX_MINED_SUCCESS: {
        id: 'app.profile.tempProfilePublishTxMinedSuccess',
        description: 'Message status when publish tx mined',
        defaultMessage: 'Publish transaction mined'
    },
    findingProfiles: {
        id: 'app.profile.findingProfiles',
        description: 'Message status when there are no temporary profiles in stores yet. But might be in database',
        defaultMessage: 'Finding profiles to publish...'
    },
    finishingProfileCreation: {
        id: 'app.profile.finishingProfileCreation',
        description: 'Message status when all steps completed and data cleanup takes longer than expected.',
        defaultMessage: 'Finishing profile publishing.'
    },
    enjoyAkasha: {
        id: 'app.profile.enjoyAkasha',
        description: 'button label when register complete',
        defaultMessage: 'Enjoy AKASHA'
    },
    tipsBeforeStart: {
        id: 'app.profile.tipsBeforeStart',
        description: 'Title for some tips before using AKASHA',
        defaultMessage: 'Tips before you get started'
    },
    weCannotHelpRecover: {
        id: 'app.profile.weCannotHelpRecover',
        description: 'text explaining we cannot recover lost passphrases',
        defaultMessage: 'Since we cannot help you recover passphrases, or identities make sure to:'
    },
    writePassKeepSafe: {
        id: 'app.profile.writePassKeepSafe',
        description: 'a tip for storing passphrase safely',
        defaultMessage: 'Write down your passphrase and keep it safe'
    },
    backupYourId: {
        id: 'app.profile.backupYourId',
        description: 'tip to backup your id',
        defaultMessage: 'Backup your ID (in the next screen) and don’t be sorry later'
    },
    dontShareKey: {
        id: 'app.profile.dontShareKey',
        description: 'tip to not share the key with anyone',
        defaultMessage: 'Don’t (ever) share your key with other people'
    },
    personalProfile: {
        id: 'app.profile.personalProfile',
        description: 'Title for edit profile panel',
        defaultMessage: 'Personal profile'
    },
    follow: {
        id: 'app.profile.follow',
        description: 'follow a profile',
        defaultMessage: 'Follow'
    },
    unfollow: {
        id: 'app.profile.unfollow',
        description: 'unfollow a profile',
        defaultMessage: 'Unfollow'
    },
    followers: {
        id: 'app.profile.followers',
        description: 'Label for followers tab',
        defaultMessage: 'Followers'
    },
    followersCount: {
        id: 'app.profile.followersCount',
        description: 'number of followers',
        defaultMessage: `{followers, number} {followers, plural,
            one {follower}
            other {followers}
        }`
    },
    following: {
        id: 'app.profile.following',
        description: 'Label for following tab',
        defaultMessage: 'Following'
    },
    followings: {
        id: 'app.profile.followings',
        description: 'Label for followings card',
        defaultMessage: 'Followings'
    },
    followingsCount: {
        id: 'app.profile.followingsCount',
        description: 'number of followings',
        defaultMessage: `{followings, number} {followings, plural,
            one {following}
            other {followings}
        }`
    },
    allEntries: {
        id: 'app.profile.allEntries',
        description: 'Label for all entries tab',
        defaultMessage: 'All entries'
    },
    interestingPeople: {
        id: 'app.profile.interestingPeople',
        description: 'Label for interesting people tab',
        defaultMessage: 'Interesting people'
    },
    lists: {
        id: 'app.profile.lists',
        description: 'Title for lists card',
        defaultMessage: 'Lists'
    },
    myBalance: {
        id: 'app.profile.myBalance',
        description: 'Title for my balance card',
        defaultMessage: 'My Balance'
    },
    receive: {
        id: 'app.profile.receive',
        description: 'Receive button label',
        defaultMessage: 'Receive'
    },
    send: {
        id: 'app.profile.send',
        description: 'send button label',
        defaultMessage: 'Send'
    },
    sendTip: {
        id: 'app.profile.sendTip',
        description: 'tooltip for send tip button',
        defaultMessage: 'Send tip'
    },
    sendingTip: {
        id: 'app.profile.sendingTip',
        description: 'tooltip for send tip button when waiting for transaction',
        defaultMessage: 'Sending tip ...'
    },
    disableNotifications: {
        id: 'app.profile.disableNotifications',
        description: 'tooltip for disable notifications button',
        defaultMessage: 'Disable notifications'
    },
    enableNotifications: {
        id: 'app.profile.enableNotifications',
        description: 'tooltip for enable notifications button',
        defaultMessage: 'Enable notifications'
    }
});
