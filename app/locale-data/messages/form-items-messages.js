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
    userName: {
        id: 'app.userName',
        description: 'Placeholder for last name input',
        defaultMessage: 'User Name'
    },
    password: {
        id: 'app.password',
        description: 'Placeholder for password input',
        defaultMessage: 'Password'
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
    }
});
export { formMessages };
