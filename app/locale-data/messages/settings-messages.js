import { defineMessages } from 'react-intl';

// keep this sorted alphabetically
const settingsMessages = defineMessages({
    chinese: {
        id: 'app.settings.chinese',
        description: 'app language',
        defaultMessage: 'Chinese'
    },
    darkTheme: {
        id: 'app.settings.darkTheme',
        description: 'theme switch',
        defaultMessage: 'Dark Theme'
    },
    description: {
        id: 'app.settings.description',
        description: 'Description for app settings',
        defaultMessage: 'Customize your app preferences'
    },
    english: {
        id: 'app.settings.english',
        description: 'app language',
        defaultMessage: 'English'
    },
    hideContent: {
        id: 'app.settings.hideContent',
        description: 'title for "hide content" settings',
        defaultMessage: 'Hide content'
    },
    hideContentDescription: {
        id: 'app.settings.hideContentDescription',
        description: 'description for "hide content" settings',
        defaultMessage: 'Choose if you don\'t want to see content with a score lower than a specific value'
    },
    hideCommentsLabel: {
        id: 'app.settings.hideCommentsLabel',
        description: 'label for "hide comments content" checkbox',
        defaultMessage: 'Hide comments with a score lower than'
    },
    hideEntriesLabel: {
        id: 'app.settings.hideEntriesLabel',
        description: 'label for "hide entries content" checkbox',
        defaultMessage: 'Hide entries with a score lower than'
    },
    passphraseOptions: {
        id: 'app.settings.passphraseOptions',
        description: 'title for profile passphrase options',
        defaultMessage: 'Passphrase Options'
    },
    passphraseOptionsDescription: {
        id: 'app.settings.passphraseOptionsDescription',
        description: 'description for profile passphrase options',
        defaultMessage: 'Choose when your password is requested'
    },
    licenseOptions: {
        id: 'app.settings.licenseOptions',
        description: 'title for profile default license options',
        defaultMessage: 'Publish Options'
    },
    licenseOptionsDescription: {
        id: 'app.settings.licenseOptionsDescription',
        description: 'description for default license options',
        defaultMessage: 'Choose the default license for articles you publish'
    },
    language: {
        id: 'app.settings.language',
        description: 'title for language form item',
        defaultMessage: 'Language'
    },
    lightTheme: {
        id: 'app.settings.lightTheme',
        description: 'theme switch',
        defaultMessage: 'Light Theme'
    },
    russian: {
        id: 'app.settings.russian',
        description: 'app language',
        defaultMessage: 'Russian'
    },
    selectLanguage: {
        id: 'app.settings.selectLanguage',
        description: 'title for language selector',
        defaultMessage: 'SELECT LANGUAGE'
    },
    spanish: {
        id: 'app.settings.spanish',
        description: 'app language',
        defaultMessage: 'Spanish'
    },
    theme: {
        id: 'app.settings.theme',
        description: 'theme switch title',
        defaultMessage: 'App Theme'
    },
    themeLabel: {
        id: 'app.settings.themeLabel',
        description: 'theme switch label',
        defaultMessage: 'Customize the look of the Akasha workspace'
    },
    tipsDescription: {
        id: 'app.settings.tipsDescription',
        description: 'description for profile tips options',
        defaultMessage: 'Select your option for tips'
    },
    tipsDisabled: {
        id: 'app.settings.tipsDisabled',
        description: 'tooltip info for profile tips options when it is disabled',
        defaultMessage: 'You need to register your profile before changing this option'
    },
    tipsOptions: {
        id: 'app.settings.tipsOptions',
        description: 'title for profile tips options',
        defaultMessage: 'Tips options'
    },
    tipsInfo: {
        id: 'app.settings.tipsInfo',
        description: 'info for profile tips options',
        defaultMessage: 'Changing this option will involve sending a transaction'
    },
    tipsAccept: {
        id: 'app.settings.tipsAccept',
        description: 'label for profile tips option',
        defaultMessage: 'Accept tips'
    },
    tipsDoNotAccept: {
        id: 'app.settings.tipsDoNotAccept',
        description: 'label for profile tips option',
        defaultMessage: 'Do not accept tips'
    },
    title: {
        id: 'app.settings.title',
        description: 'Title for app settings',
        defaultMessage: 'App preferences'
    },
    update: {
        id: 'app.settings.update',
        description: 'description for update buton',
        defaultMessage: 'Update Settings'
    },
    notificationsPreference: {
        id: 'app.settings.notificationsPreference',
        description: 'title for notification settings',
        defaultMessage: 'Notifications Settings'
    },
    tips: {
        id: 'app.settings.tips',
        description: 'Title for tips',
        defaultMessage: 'Tips'
    },
    votes: {
        id: 'app.settings.votes',
        description: 'Title for votes',
        defaultMessage: 'Votes'
    },
    notificationsInfo: {
        id: 'app.settings.notificationsInfo',
        description: 'description for notification preferences',
        defaultMessage: 'Your notification preferences for Akasha'
    },
    trustedDomainsOptions: {
        id: 'app.settings.trustedDomainsOptions',
        description: 'Title for trusted domains user settings',
        defaultMessage: 'Trusted Domains'
    },
    trustedDomainsManage: {
        id: 'app.settings.trustedDomainsManage',
        description: 'manage trusted domains',
        defaultMessage: 'Manage your trusted domains here'
    },
    trustedDomainsOptionsDescription: {
        id: 'app.settings.trustedDomainsOptionsDescription',
        description: 'description for trusted domains user settings',
        defaultMessage: 'External links to which you can navigate without being prompted'
    },
    arabic: {
        id: 'app.settings.arabic',
        description: 'arabic language',
        defaultMessage: 'Arabic'
    },
    chineseSimplified: {
        id: 'app.settings.chineseSimplified',
        description: 'chinese simplified language',
        defaultMessage: 'Chinese (Simplified)'
    },
    filipino: {
        id: 'app.settings.filipino',
        description: 'filipino language',
        defaultMessage: 'Filipino'
    },
    finnish: {
        id: 'app.settings.finnish',
        description: 'Finnish language',
        defaultMessage: 'Finnish'
    },
    french: {
        id: 'app.settings.french',
        description: 'french language',
        defaultMessage: 'French'
    },
    german: {
        id: 'app.settings.german',
        description: 'german language',
        defaultMessage: 'German'
    },
    indonesian: {
        id: 'app.settings.indonesian',
        description: 'indonesian language',
        defaultMessage: 'Indonesian'
    },
    italian: {
        id: 'app.settings.italian',
        description: 'italian language',
        defaultMessage: 'Italian'
    },
    japanese: {
        id: 'app.settings.japanese',
        description: 'japanese language',
        defaultMessage: 'Japanese'
    },
    korean: {
        id: 'app.settings.korean',
        description: 'korean language',
        defaultMessage: 'Korean'
    },
    portuguese: {
        id: 'app.settings.portuguese',
        description: 'portuguese language',
        defaultMessage: 'Portuguese'
    },
    portugueseBrazilian: {
        id: 'app.settings.portugueseBrazilian',
        description: 'portuguese brazilian language',
        defaultMessage: 'Portuguese, Brazilian'
    },
    turkish: {
        id: 'app.settings.turkish',
        description: 'turkish language',
        defaultMessage: 'Turkish'
    },

    ukrainian: {
        id: 'app.settings.ukrainian',
        description: 'ukrainian language',
        defaultMessage: 'Ukrainian'
    },
});
export { settingsMessages };
