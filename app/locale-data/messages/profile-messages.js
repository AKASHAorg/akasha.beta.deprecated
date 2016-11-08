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
    aboutYouTitle: {
        id: 'app.profile.aboutYouTitle',
        description: 'About You section title',
        defaultMessage: 'About You'
    },
    shortDescriptionLabel: {
        id: 'app.profile.shortDescriptionLabel',
        description: 'Label for Short description text field',
        defaultMessage: 'Short description'
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
    keepAccUnlockedLabel: {
        id: 'app.profile.keepAccUnlocked',
        description: 'Label for "Keep Account Unlocked For" checkbox',
        defaultMessage: 'Keep account unlocked for'
    },
    terms: {
        id: 'app.profile.terms',
        description: `Terms agreement for account creation.
                        Do not translate {termsLink} and {privacyLink}!`,
        defaultMessage: `By proceeding to create your account and use AKASHA, you are agreeing to
                         our {termsLink} and {privacyLink}. If you do not agree, you cannot use
                         AKASHA.`
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
        description: 'text explaining we cannot recover lost pass',
        defaultMessage: 'Since we cannot help you recover passwords, or identities make sure to:'
    },
    writePassKeepSafe: {
        id: 'app.profile.writePassKeepSafe',
        description: 'a tip for storing password safely',
        defaultMessage: 'Write down your password and keep it safe'
    },
    backupYourId: {
        id: 'app.profile.backupYourId',
        description: 'tip to backup your id',
        defaultMessage: 'Backup your ID now and don’t be sorry later'
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
    }
});
