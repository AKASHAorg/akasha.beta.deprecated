import { defineMessages } from 'react-intl';

export const profileMessages = defineMessages({
    amountPlaceholder: {
        id: 'app.profile.amountPlaceholder',
        description: 'placeholder for amount input',
        defaultMessage: 'Type an amount'
    },
    avatarTitle: {
        id: 'app.profile.avatarTitle',
        description: 'Avatar section title',
        defaultMessage: 'PROFILE PICTURE'
    },
    backgroundImageTitle: {
        id: 'app.profile.backgroundImageTitle',
        description: 'Background image section title',
        defaultMessage: 'COVER PHOTO'
    },
    backgroundImageTooltip: {
        id: 'app.profile.backgroundImageTooltip',
        description: 'Background image section tooltip',
        defaultMessage: 'Please upload a picture with a ratio of 2:1'
    },
    aboutMeCharCount: {
        id: 'app.profile.aboutMeCharCount',
        description: 'About Me character counter title',
        defaultMessage: 'Characters left:'
    },
    aboutMeTitle: {
        id: 'app.profile.aboutMeTitle',
        description: 'About Me section title',
        defaultMessage: 'About me'
    },
    essenceReady: {
        id: 'app.profile.essenceReady',
        description: 'title for Essence popover',
        defaultMessage: 'Ready to collect'
    },
    contacts: {
        id: 'app.profile.contacts',
        description: 'Contacts card title',
        defaultMessage: 'Contacts'
    },
    cycledAmountAvailable: {
        id: 'app.profile.cycledAmountAvailable',
        description: 'amount of cycled AETH available to be collected',
        defaultMessage: 'Amount available {amount} AETH'
    },
    cyclingComplete: {
        id: 'app.profile.cyclingComplete',
        description: 'cycling process complete',
        defaultMessage: 'Cycling complete'
    },
    cyclingPlaceholder: {
        id: 'app.profile.cyclingPlaceholder',
        description: 'placeholder for empty cycling AETH table',
        defaultMessage: 'No AETH cycling in progress'
    },
    cyclingProcess: {
        id: 'app.profile.cyclingProcess',
        description: 'cycling process in progress',
        defaultMessage: 'Cycling process'
    },
    editProfileTitle: {
        id: 'app.profile.editProfileTitle',
        description: 'Edit profile page title',
        defaultMessage: 'Edit Profile Information'
    },
    shortDescriptionLabel: {
        id: 'app.profile.shortDescriptionLabel',
        description: 'Label for Short description text field',
        defaultMessage: 'Type something about you'
    },
    karmaLevel: {
        id: 'app.profile.karmaLevel',
        description: 'Karma level',
        defaultMessage: 'Karma lvl {karmaLevel}'
    },
    linksPlaceholder: {
        id: 'app.profile.linksPlaceholder',
        description: 'Links placeholder text',
        defaultMessage: 'Type or paste your link'
    },
    linksTitle: {
        id: 'app.profile.linksTitle',
        description: 'Links section title',
        defaultMessage: 'LINKS'
    },
    addLinkButtonTitle: {
        id: 'app.profile.addLinkButtontitle',
        description: 'title for add link button',
        defaultMessage: 'Add a new link'
    },
    removeLinkButtonTitle: {
        id: 'app.profile.removeLinkButtonTitle',
        description: 'tooltip for Remove Link button',
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
        defaultMessage: 'Cryptocurrency name'
    },
    cryptoAddress: {
        id: 'app.profile.cryptoAddress',
        description: 'crypto address label',
        defaultMessage: 'Cryptocurrency address'
    },
    registerProfile: {
        id: 'app.profile.registerProfile',
        description: 'register profile button label',
        defaultMessage: 'Register Profile'
    },
    removeCryptoButtonTitle: {
        id: 'app.profile.removeCryptoButtonTitle',
        description: 'remove crypto button label',
        defaultMessage: 'Remove cryptocurrency link'
    },
    entries: {
        id: 'app.profile.entries',
        description: 'Title for entries column',
        defaultMessage: 'Entries'
    },
    follow: {
        id: 'app.profile.follow',
        description: 'follow a profile',
        defaultMessage: 'Follow'
    },
    updateProfile: {
        id: 'app.profile.updateProfile',
        description: 'update a profile',
        defaultMessage: 'Update Profile'
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
        description: 'following an user',
        defaultMessage: 'Following'
    },
    followings: {
        id: 'app.profile.followings',
        description: 'Label for following card',
        defaultMessage: 'Following'
    },
    followingsCount: {
        id: 'app.profile.followingsCount',
        description: 'number of followings',
        defaultMessage: `{followings, number} {followings, plural,
            one {following}
            other {followings}
        }`
    },
    highlights: {
        id: 'app.profile.highlights',
        description: 'title for highlights card',
        defaultMessage: 'Highlights'
    },
    lists: {
        id: 'app.profile.lists',
        description: 'Title for lists card',
        defaultMessage: 'Lists'
    },
    myBalance: {
        id: 'app.profile.myBalance',
        description: 'Title for my balance card',
        defaultMessage: 'My balance'
    },
    myEntries: {
        id: 'app.profile.myEntries',
        description: 'Title for my entries',
        defaultMessage: 'My entries'
    },
    myProfile: {
        id: 'app.profile.myProfile',
        description: 'Title for profile overview sidebar',
        defaultMessage: 'My profile'
    },
    noPendingTransactions: {
        id: 'app.profile.noPendingTransactions',
        description: 'placeholder message for empty pending transactions log',
        defaultMessage: 'You have no pending transactions'
    },
    noProfiles: {
        id: 'app.entry.noProfiles',
        description: 'placeholder for empty profiles list',
        defaultMessage: 'No profiles yet'
    },
    noTransactions: {
        id: 'app.profile.noTransactions',
        description: 'placeholder message for empty transactions history log',
        defaultMessage: 'You have no transactions'
    },
    overview: {
        id: 'app.profile.overview',
        description: 'Title for overview card',
        defaultMessage: 'Overview'
    },
    profileDoesntExist: {
        id: 'app.profile.profileDoesntExist',
        description: 'placeholder message for entry list when username does not exist',
        defaultMessage: 'This username doesn\'t exist'
    },
    settings: {
        id: 'app.profile.settings',
        description: 'Title for profile settings',
        defaultMessage: 'Settings'
    },
    receive: {
        id: 'app.profile.receive',
        description: 'Receive button label',
        defaultMessage: 'Receive'
    },
    receiverPlaceholder: {
        id: 'app.profile.receiverPlaceholder',
        description: 'Placeholder for receiver input',
        defaultMessage: 'Type a username or paste an ethereum address'
    },
    rewardsAndGoals: {
        id: 'app.profile.rewardsAndGoals',
        description: 'Title for rewards and goals card',
        defaultMessage: 'Rewards and goals'
    },
    saveForLater: {
        id: 'app.profile.saveForLater',
        description: 'Save for later button label',
        defaultMessage: 'Save for later'
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
    sendTipTo: {
        id: 'app.profile.sendTipTo',
        description: 'title for send tip form',
        defaultMessage: 'Send tip to {name}'
    },
    sendTo: {
        id: 'app.profile.sendTo',
        description: 'label for receiver input',
        defaultMessage: 'Send to'
    },
    sentTip: {
        id: 'app.profile.sentTip',
        description: 'sent tip action',
        defaultMessage: 'Sent tip'
    },
    support: {
        id: 'app.profile.support',
        description: 'support/tip a user',
        defaultMessage: 'Support'
    },
    supported: {
        id: 'app.profile.supported',
        description: 'supported by someone',
        defaultMessage: 'Supported'
    },
    supporting: {
        id: 'app.profile.supporting',
        description: 'supporting someone',
        defaultMessage: 'Supporting'
    },
    tipAmount: {
        id: 'app.profile.tipAmount',
        description: 'placeholder for tip amount input',
        defaultMessage: 'Tip amount'
    },
    totalBalance: {
        id: 'app.profile.totalBalance',
        description: 'total ETH balance',
        defaultMessage: 'Total balance'
    },
    transactionsLog: {
        id: 'app.profile.transactionsLog',
        description: 'title for transactions log panel',
        defaultMessage: 'Transactions log'
    },
    transactionsLogSubtitle: {
        id: 'app.profile.transactionsLogSubtitle',
        description: 'subtitle for transactions log panel',
        defaultMessage: 'Your interactions with the blockchain'
    },
    unfollow: {
        id: 'app.profile.unfollow',
        description: 'unfollow a profile',
        defaultMessage: 'Unfollow'
    },
    yourEthAddress: {
        id: 'app.profile.yourEthAddress',
        description: 'label for ethereum address input',
        defaultMessage: 'Your ethereum address'
    },
    noNotifications: {
        id: 'app.profile.noNotifications',
        description: 'placeholder message for empty notifcations panel log',
        defaultMessage: 'You have not received any new notifications'
    },
    profiles: {
        id: 'app.profile.profiles',
        description: 'plural form of profile :)',
        defaultMessage: 'profiles'
    },
    comments: {
        id: 'app.profile.comments',
        description: 'label for profile comments column',
        defaultMessage: 'Comments'
    }
});
