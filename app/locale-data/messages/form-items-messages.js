import { defineMessages } from 'react-intl';

const formMessages = defineMessages({
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
    passphrase: {
        id: 'app.passphrase',
        description: 'Placeholder for passphrase input',
        defaultMessage: 'Passphrase'
    },
    confirmPassphrase: {
        id: 'app.form.confirmPassphrase',
        description: 'authenticate dialog title',
        defaultMessage: 'Confirm passphrase'
    },
    confirmPassphraseToContinue: {
        id: 'app.form.confirmPassphraseToContinue',
        description: 'Label for confirming passphrase',
        defaultMessage: 'You need to confirm your passphrase to continue'
    },
    passphraseVerify: {
        id: 'app.passphraseVerify',
        description: 'Placeholder for passphrase verify input',
        defaultMessage: 'Verify passphrase'
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
    name: {
        id: 'app.inputField.name',
        description: 'Placeholder for name input field',
        defaultMessage: 'Name'
    },
    gasAmountError: {
        id: 'app.form.gasAmountError',
        description: 'Error displayed when gas amount is not between limits',
        defaultMessage: 'Gas amount must be between {min} and {max}'
    },
    voteWeightError: {
        id: 'app.form.voteWeightError',
        description: 'Error displayed when vote weight is not between limits',
        defaultMessage: 'Vote weight must be between {minWeight} and {maxWeight}'
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
    tipDecimalsError: {
        id: 'app.form.tipDecimalsError',
        description: 'Error displayed when the tip amount has more decimals than the maximum allowed',
        defaultMessage: 'The amount should not have more than {maxDecimals} decimals'
    }
});
export { formMessages };
