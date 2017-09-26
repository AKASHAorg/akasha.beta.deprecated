import { defineMessages } from 'react-intl';

export const profileMessages = defineMessages({
    activity: {
        id: 'app.activity',
        description: 'Activity section title',
        defaultMessage: 'activity'
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
    entries: {
        id: 'app.profile.entries',
        description: 'Title for entries card',
        defaultMessage: 'Entries'
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
        defaultMessage: 'My Balance'
    },
    myProfile: {
        id: 'app.profile.myProfile',
        description: 'Title for profile overview sidebar',
        defaultMessage: 'MY PROFILE'
    },
    overview: {
        id: 'app.profile.overview',
        description: 'Title for overview card',
        defaultMessage: 'Overview'
    },
    settings: {
        id: 'app.profile.settings',
        description: 'Title for profile settings',
        defaultMessage: 'Profile Settings'
    },
    receive: {
        id: 'app.profile.receive',
        description: 'Receive button label',
        defaultMessage: 'Receive'
    },
    rewardsAndGoals: {
        id: 'app.profile.rewardsAndGoals',
        description: 'Title for rewards and goals card',
        defaultMessage: 'Rewards and Goals'
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
    tipAmount: {
        id: 'app.profile.tipAmount',
        description: 'placeholder for tip amount input',
        defaultMessage: 'Tip amount'
    }
});
