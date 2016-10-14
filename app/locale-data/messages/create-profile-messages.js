import { defineMessages } from 'react-intl';

export const profileMessages = defineMessages({
    createProfileTitle: {
        id: 'app.createProfileTitle',
        description: 'Modal title for new identity form',
        defaultMessage: 'Create new identity'
    },
    optionalDetailsLabel: {
        id: 'app.createProfile.optionalDetailsLabel',
        description: 'Label for optional details checkbox',
        defaultMessage: 'Optional details'
    },
    avatarTitle: {
        id: 'app.createProfile.avatarTitle',
        description: 'Avatar section title',
        defaultMessage: 'Avatar'
    },
    backgroundImageTitle: {
        id: 'app.createProfile.backgroundImageTitle',
        description: 'Background image section title',
        defaultMessage: 'Background image'
    },
    aboutYouTitle: {
        id: 'app.createProfile.aboutYouTitle',
        description: 'About You section title',
        defaultMessage: 'About You'
    },
    shortDescriptionLabel: {
        id: 'app.createProfile.shortDescriptionLabel',
        description: 'Label for Short description text field',
        defaultMessage: 'Short description'
    },
    linksTitle: {
        id: 'app.createProfile.linksTitle',
        description: 'Links section title',
        defaultMessage: 'Links'
    },
    addLinkButtonTitle: {
        id: 'app.createProfile.addLinkButtontitle',
        description: 'text shown when hovering Add Link button',
        defaultMessage: 'add link'
    },
    removeLinkButtonTitle: {
        id: 'app.createProfile.removeLinkButtonTitle',
        description: 'text shown when hovering Remove Link button',
        defaultMessage: 'remove link'
    },
    keepAccUnlockedLabel: {
        id: 'app.createProfile.keepAccUnlocked',
        description: 'Label for "Keep Account Unlocked For" checkbox',
        defaultMessage: 'Keep account unlocked for'
    },
    terms: {
        id: 'app.createProfile.terms',
        description: `Terms agreement for account creation.
                        Do not translate {termsLink} and {privacyLink}!`,
        defaultMessage: `By proceeding to create your account and use AKASHA, you are agreeing to
                         our {termsLink} and {privacyLink}. If you do not agree, you cannot use
                         AKASHA.`
    },
    registeringIdentity: {
        id: 'app.createProfile.registeringIdentity',
        description: 'Registering identity status',
        defaultMessage: 'Registering identity'
    },
    yourIdentityIsBroadcasted: {
        id: 'app.createProfile.yourIdentityIsBroadcasted',
        description: 'describing that identity is broadcasted into network',
        defaultMessage: 'Your identity is broadcasted into the Ethereum world computer network.'
    },
    willTakeFewMoments: {
        id: 'app.createProfile.willTakeFewMinutes',
        description: 'action `will take a few moments` to complete',
        defaultMessage: 'This will take a few moments'
    },
    enjoyAkasha: {
        id: 'app.createProfile.enjoyAkasha',
        description: 'button label when register complete',
        defaultMessage: 'Enjoy AKASHA'
    },
    tipsBeforeStart: {
        id: 'app.createProfile.tipsBeforeStart',
        description: 'Title for some tips before using AKASHA',
        defaultMessage: 'Tips before you get started'
    },
    weCannotHelpRecover: {
        id: 'app.createProfile.weCannotHelpRecover',
        description: 'text explaining we cannot recover lost pass',
        defaultMessage: 'Since we cannot help you recover passwords, or identities make sure to:'
    },
    writePassKeepSafe: {
        id: 'app.createProfile.writePassKeepSafe',
        description: 'a tip for storing password safely',
        defaultMessage: 'Write down your password and keep it safe'
    },
    backupYourId: {
        id: 'app.createProfile.backupYourId',
        description: 'tip to backup your id',
        defaultMessage: 'Backup your ID now and don’t be sorry later'
    },
    dontShareKey: {
        id: 'app.createProfile.dontShareKey',
        description: 'tip to not share the key with anyone',
        defaultMessage: 'Don’t (ever) share your key with other people'
    }
});
