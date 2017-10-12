import { defineMessages } from 'react-intl';

const formMessages = defineMessages({
    aethAmountLabel: {
        id: 'app.form.aethAmount',
        description: 'aeth amount input label',
        defaultMessage: 'AETH amount'
    },
    aethAmountRequired: {
        id: 'app.form.aethAmountRequired',
        description: 'aeth amount input required error message',
        defaultMessage: 'AETH amount is required'
    },
    maxAethAmountLabel: {
        id: 'app.form.maxAethAmount',
        description: 'max aeth amount label',
        defaultMessage: 'max. {balance}'
    },
    messageOptional: {
        id: 'app.form.messageOptional',
        description: 'tip message input label',
        defaultMessage: 'Message (Optional)'
    },
    firstName: {
        id: 'app.firstName',
        description: 'Placeholder for first name input',
        defaultMessage: 'First Name'
    },
    lastName: {
        id: 'app.lastName',
        description: 'Placeholder for last name input',
        defaultMessage: 'Last Name'
    },
    akashaId: {
        id: 'app.akashaId',
        description: 'Placeholder for last name input',
        defaultMessage: 'Akasha ID'
    },
    ethereumAddress: {
        id: 'app.form.ethereumAddress',
        description: 'Placeholder for ethereum address input',
        defaultMessage: 'Ethereum address'
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
    amountToShift: {
        id: 'app.form.amountToShift',
        description: 'label for shift amount slider',
        defaultMessage: 'Please select an amount to shift'
    },
    confirmPassphrase: {
        id: 'app.form.confirmPassphrase',
        description: 'label for passphrase fghfgconfirmation input',
        defaultMessage: 'Confirm passphrase'
    },
    confirmPassphraseToContinue: {
        id: 'app.form.confirmPassphraseToContinue',
        description: 'Label for confirming passphrase',
        defaultMessage: 'You need to confirm your passphrase to continue'
    },
    freeAeth: {
        id: 'app.form.freeAeth',
        description: 'label for free AETH value',
        defaultMessage: 'Free AETH'
    },
    gasAmountError: {
        id: 'app.form.gasAmountError',
        description: 'Error displayed when gas amount is not between limits',
        defaultMessage: 'Gas amount must be between {min} and {max}'
    },
    manaTotalScore: {
        id: 'app.form.manaTotalScore',
        description: 'label for mana total score',
        defaultMessage: 'Mana total score'
    },
    name: {
        id: 'app.inputField.name',
        description: 'Placeholder for name input field',
        defaultMessage: 'Name'
    },
    passphraseConfirmError: {
        id: 'app.form.passphraseConfirmError',
        description: 'Error message displayed when the given passphrases don\'t match',
        defaultMessage: 'Passphrases don\'t match. Please type the passphrase again'
    },
    passphraseVerify: {
        id: 'app.passphraseVerify',
        description: 'Placeholder for passphrase verify input',
        defaultMessage: 'Verify passphrase'
    },
    requiredError: {
        id: 'app.form.requiredError',
        description: 'error message for required fields',
        defaultMessage: 'This field is required'
    },
    shiftDownMana: {
        id: 'app.form.shiftDownMana',
        description: 'title for shift down mana form',
        defaultMessage: 'Shift down mana'
    },
    shiftDownManaHelp: {
        id: 'app.form.shiftDownManaHelp',
        description: 'label for shift down mana slider',
        defaultMessage: '{value} AETH will be unlocked in 2 days'
    },
    shiftUpMana: {
        id: 'app.form.shiftUpMana',
        description: 'title for shift up mana form',
        defaultMessage: 'Shift up mana'
    },
    shiftUpManaHelp: {
        id: 'app.form.shiftUpManaHelp',
        description: 'label for shift up mana slider',
        defaultMessage: '{value} AETH will generate {value} Mana daily'
    },
    title: {
        id: 'app.inputField.title',
        description: 'Placeholder for title input field',
        defaultMessage: 'Title'
    },
    url: {
        id: 'app.inputField.url',
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
    notEnoughFunds: {
        id: 'app.form.notEnoughFunds',
        description: 'Error displayed when a user does not have enough funds for an action',
        defaultMessage: 'You don\'t have enough funds in your balance'
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
    tooShortError: {
        id: 'app.form.tooShortError',
        description: 'Error displayed when a tag contains less than 4 characters',
        defaultMessage: 'Tags should have at least 4 characters.'
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
        description: 'Label for checkbox to remember password',
        defaultMessage: 'Remember my passphrase for'
    },
    tipAmountError: {
        id: 'app.form.tipAmountError',
        description: 'Error displayed when the tip amount is smaller than the minimum allowed value',
        defaultMessage: 'The amount should be at least {minAmount} AETH'
    },
    updateSettings: {
        id: 'app.form.updateSettings',
        description: 'label for update settings button',
        defaultMessage: 'Update settings'
    }
});
export { formMessages };
