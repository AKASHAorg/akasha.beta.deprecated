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
        description: 'Label for Keep Account Unlocked For checkbox',
        defaultMessage: 'Keep account unlocked for'
    },
    terms: {
        id: 'app.createProfile.terms',
        description: `Terms agreement for account creation.
                        Do not translate {termsLink} and {privacyLink}!`,
        defaultMessage: `By proceeding to create your account and use AKASHA, you are agreeing to
                         our {termsLink} and {privacyLink}. If you do not agree, you cannot use
                         AKASHA.`
    }
});
