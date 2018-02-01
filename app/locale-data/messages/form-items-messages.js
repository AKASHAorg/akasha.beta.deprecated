import { defineMessages } from 'react-intl';

const formMessages = defineMessages({
    about: {
        id: 'app.form.about',
        description: 'label for about me validation',
        defaultMessage: 'About Me'
    },
    addressRequired: {
        id: 'app.form.addressRequired',
        description: 'error message for empty receiver input field',
        defaultMessage: 'You must specify a username or an ethereum address'
    },
    acceptTips: {
        id: 'app.form.acceptTips',
        description: 'label for accept tips switch (personal settings)',
        defaultMessage: 'Accept tips'
    },
    akashaIdPlaceholder: {
        id: 'app.form.akashaIdPlaceholder',
        description: 'placeholder for username input field',
        defaultMessage: 'Type your username'
    },
    insufficientEth: {
        id: 'app.form.insufficientEth',
        description: 'title for insufficient funds card',
        defaultMessage: 'Sorry, you don\'t have enough test ether!'
    },
    depositEth: {
        id: 'app.form.depositEth',
        description: 'description for insufficient funds card',
        defaultMessage: 'You need to deposit test ether to publish your profile.'
    },
    aethAmountLabel: {
        id: 'app.form.aethAmount',
        description: 'aeth amount input label',
        defaultMessage: 'AETH amount'
    },
    amountRequired: {
        id: 'app.form.amountRequired',
        description: 'error message for empty amount input field',
        defaultMessage: 'Amount is required'
    },
    ethAmountLabel: {
        id: 'app.form.ethAmount',
        description: 'eth amount input label',
        defaultMessage: 'ETH amount'
    },
    firstNamePlaceholder: {
        id: 'app.form.firstNamePlaceholder',
        description: 'placeholder for first name input field',
        defaultMessage: 'Type your first name'
    },
    lastNamePlaceholder: {
        id: 'app.form.lastNamePlaceholder',
        description: 'placeholder for last name input field',
        defaultMessage: 'Type your last name'
    },
    maxAethAmount: {
        id: 'app.form.maxAethAmount',
        description: 'maximum amount of AETH transferable',
        defaultMessage: '{aeth} Transferable AETH'
    },
    maxAethAmountLabel: {
        id: 'app.form.maxAethAmountLabel',
        description: 'label for maximum AETH amount input field',
        defaultMessage: 'max. {balance}'
    },
    maxEssenceAmount: {
        id: 'app.form.maxEssenceAmount',
        description: 'maximum amount of Essence transformable',
        defaultMessage: '{essence} Essence available'
    },
    maxEthAmount: {
        id: 'app.form.maxEthAmount',
        description: 'maximum amount of ETH transferable',
        defaultMessage: '{eth} ETH transferable'
    },
    maxManafiedAethAmount: {
        id: 'app.form.maxManafiedAethAmount',
        description: 'maximum amount of Manafied AETH (AETH that can be cycled)',
        defaultMessage: '{manafied} Manafied AETH'
    },
    transformEssence: {
        id: 'app.form.transformEssence',
        description: 'title for transform essence form',
        defaultMessage: 'Transform Essence'
    },
    transformEssenceDisclaimer: {
        id: 'app.form.transformEssenceDisclaimer',
        description: 'disclaimer message for transforming Essence to AETH',
        defaultMessage: '{amount} Essence will forge {value} new AETH in your balance.'
    },
    transformEssenceMin: {
        id: 'app.form.transformEssenceMin',
        description: 'disclaimer message for minimum amount of essence that can be transformed',
        defaultMessage: 'You need to transform minimum 1000 Essence'
    },
    transformManafiedDisclaimer: {
        id: 'app.form.transformManafiedDisclaimer',
        description: 'disclaimer message for transforming manafied/bonded AETH to cycling AETH',
        defaultMessage: '{amount} AETH will cycle back into transferable AETH in 7 days. {amount} Mana will no longer regenerate.'
    },
    transformTransferableDisclaimer: {
        id: 'app.form.transformTransferableDisclaimer',
        description: 'disclaimer message for transforming manafied/bonded AETH to cycling AETH',
        defaultMessage: '{amount} AETH will generate {amount} Mana every 24 hours for as long as it is kept in this state.'
    },
    firstName: {
        id: 'app.form.firstName',
        description: 'Placeholder for first name input',
        defaultMessage: 'First name'
    },
    lastName: {
        id: 'app.form.lastName',
        description: 'Placeholder for last name input',
        defaultMessage: 'Last Name'
    },
    akashaId: {
        id: 'app.form.akashaId',
        description: 'Placeholder for username (Akasha ID) input',
        defaultMessage: 'Username'
    },
    ethereumAddress: {
        id: 'app.form.ethereumAddress',
        description: 'Placeholder for ethereum address input',
        defaultMessage: 'Ethereum address'
    },
    from: {
        id: 'app.form.from',
        description: 'from',
        defaultMessage: 'From'
    },
    passphrase: {
        id: 'app.form.passphrase',
        description: 'label for passphrase input',
        defaultMessage: 'Passphrase'
    },
    passphrasePlaceholder: {
        id: 'app.form.passphrasePlaceholder',
        description: 'placeholder for passphrase input',
        defaultMessage: 'Type your passphrase'
    },
    amountToForge: {
        id: 'app.form.amountToForge',
        description: 'label for forge AETH amount slider',
        defaultMessage: 'Select the amount of Essence to be transformed'
    },
    amountToShift: {
        id: 'app.form.amountToShift',
        description: 'label for shift amount slider',
        defaultMessage: 'Please select an amount to shift'
    },
    fromManafiedToCycling: {
        id: 'app.form.fromManafiedToCycling',
        description: 'label for shift amount slider',
        defaultMessage: 'From Manafied to Cycling'
    },
    fromTransferableToManafied: {
        id: 'app.form.fromTransferableToManafied',
        description: 'label for shift amount slider',
        defaultMessage: 'From Transferable to Manafied'
    },
    confirmPassphrase: {
        id: 'app.form.confirmPassphrase',
        description: 'label for passphrase confirmation input',
        defaultMessage: 'Confirm passphrase'
    },
    forgeAeth: {
        id: 'app.form.forgeAeth',
        description: 'transform Essence into new AETH',
        defaultMessage: 'Forge AETH'
    },
    freeAeth: {
        id: 'app.form.freeAeth',
        description: 'label for free AETH value',
        defaultMessage: 'Free AETH'
    },
    manaTotalScore: {
        id: 'app.form.manaTotalScore',
        description: 'label for mana total score',
        defaultMessage: 'Mana total score'
    },
    name: {
        id: 'app.form.name',
        description: 'Placeholder for name input field',
        defaultMessage: 'Name'
    },
    passphraseConfirmError: {
        id: 'app.form.passphraseConfirmError',
        description: 'Error message displayed when the given passphrases don\'t match',
        defaultMessage: 'Passphrases don\'t match. Please type the passphrases again'
    },
    passphraseVerify: {
        id: 'app.form.passphraseVerify',
        description: 'Placeholder for passphrase verify input',
        defaultMessage: 'Verify passphrase'
    },
    requiredError: {
        id: 'app.form.requiredError',
        description: 'error message for required fields',
        defaultMessage: 'This field is required'
    },
    shiftDown: {
        id: 'app.form.shiftDown',
        description: 'shift down',
        defaultMessage: 'Decrease'
    },
    shiftDownMana: {
        id: 'app.form.shiftDownMana',
        description: 'title for shift down Mana form',
        defaultMessage: 'Decrease Mana Pool'
    },
    shiftDownManaHelp: {
        id: 'app.form.shiftDownManaHelp',
        description: 'label for shift down Mana slider',
        defaultMessage: '{value} Mana will transform {value} Manafied AETH to Cycling AETH that can be collected in 7 days.'
    },
    shiftUp: {
        id: 'app.form.shiftUp',
        description: 'shift up',
        defaultMessage: 'Increase'
    },
    shiftUpMana: {
        id: 'app.form.shiftUpMana',
        description: 'title for shift up Mana form',
        defaultMessage: 'Increase Mana Pool'
    },
    shiftUpManaHelp: {
        id: 'app.form.shiftUpManaHelp',
        description: 'label for shift up mana slider',
        defaultMessage: '{value} AETH will generate {value} Mana'
    },
    tips: {
        id: 'app.form.tips',
        description: 'label for tips',
        defaultMessage: 'TIPS'
    },
    title: {
        id: 'app.form.title',
        description: 'Placeholder for title input field',
        defaultMessage: 'Title'
    },
    totalAethBalance: {
        id: 'app.form.totalAethBalance',
        description: 'label for total AETH balance',
        defaultMessage: 'Total AETH balance'
    },
    url: {
        id: 'app.form.url',
        description: 'Placeholder for url input field',
        defaultMessage: 'URL'
    },
    voteWeightIntegerError: {
        id: 'app.form.voteWeightIntegerError',
        description: 'Error displayed when vote weight is not an integer',
        defaultMessage: 'Vote weight must be an integer'
    },
    voteWeightRangeError: {
        id: 'app.form.voteWeightRangeError',
        description: 'Error displayed when vote weight is not between limits',
        defaultMessage: 'Vote weight must be between {min} and {max}'
    },
    voteWeightRequired: {
        id: 'app.form.voteWeightRequired',
        description: 'Error displayed when vote weight is not specified',
        defaultMessage: 'Vote weight is required'
    },
    voteWeightExtra: {
        id: 'app.form.voteWeightExtra',
        description: 'extra information about the vote weight input',
        defaultMessage: 'Define a value between {min} and {max}'
    },
    notEnoughMana: {
        id: 'app.form.notEnoughMana',
        description: 'Error displayed when a user does not have enough Mana for an action',
        defaultMessage: 'You don\'t have enough Mana for this action'
    },
    alphanumericError: {
        id: 'app.form.alphanumericError',
        description: 'Error displayed when a tag contains invalid characters',
        defaultMessage: 'Tags can contain only letters, numbers, and one dash ( - ) or underscore ( _ ) between characters.'
    },
    selectOneOption: {
        id: 'app.form.selectOneOption',
        description: 'Label for simple select field',
        defaultMessage: 'Select one option'
    },
    tooLongError: {
        id: 'app.form.tooLongError',
        description: 'Error displayed when a tag contains more than 24 characters',
        defaultMessage: 'Tags can have maximum 24 characters.'
    },
    tagAlreadyAdded: {
        id: 'app.form.tagAlreadyAdded',
        description: 'Error displayed when trying to add a tag that already exists',
        defaultMessage: 'Tag {tag} already added'
    },
    rememberPassFor: {
        id: 'app.form.rememberPassFor',
        description: 'Label for checkbox to remember passphrase',
        defaultMessage: 'Remember my passphrase for'
    },
    tipAmountError: {
        id: 'app.form.tipAmountError',
        description: 'Error displayed when the tip amount is smaller than the minimum allowed value',
        defaultMessage: 'The amount should be at least {minAmount} AETH'
    },
    to: {
        id: 'app.form.to',
        description: 'to',
        defaultMessage: 'To'
    },
    updateSettings: {
        id: 'app.form.updateSettings',
        description: 'label for update settings button',
        defaultMessage: 'Update Settings'
    },
    navigationError: {
        id: 'app.form.navigationError',
        description: 'error message for invalid Akasha link',
        defaultMessage: 'This is not a valid AKASHA link'
    },
    navigateTitle: {
        id: 'app.form.navigateTitle',
        description: 'title for the navigation modal',
        defaultMessage: 'Paste an AKASHA link here'
    },
    navigateSubtitle: {
        id: 'app.form.navigateSubtitle',
        description: 'subtitle for the navigation modal',
        defaultMessage: 'Insert a link to navigate to an entry or a profile page'
    },
    shareLinkTitle: {
        id: 'app.form.shareLinkTitle',
        description: 'title for the share link modal',
        defaultMessage: 'Share link'
    },
    shareLinkSubtitle: {
        id: 'app.form.shareLinkSubtitle',
        description: 'subtitle for the share link modal',
        defaultMessage: 'This is an internal link that can only be used inside the Akasha app'
    },
});
export { formMessages };
