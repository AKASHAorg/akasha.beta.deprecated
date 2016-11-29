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
    password: {
        id: 'app.password',
        description: 'Placeholder for password input',
        defaultMessage: 'Password'
    },
    confirmPassword: {
        id: 'app.form.confirmPassword',
        description: 'authenticate dialog title',
        defaultMessage: 'Confirm password'
    },
    confirmPasswordToContinue: {
        id: 'app.form.confirmPasswordToContinue',
        description: 'Label for confirming password',
        defaultMessage: 'You need to confirm your password to continue'
    },
    passwordVerify: {
        id: 'app.passwordVerify',
        description: 'Placeholder for password verify input',
        defaultMessage: 'Verify Password'
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
    }
});
export { formMessages };
