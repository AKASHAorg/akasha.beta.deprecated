import { defineMessages } from 'react-intl';

const validationMessages = defineMessages({
    required: {
        id: 'app.validator.required',
        description: `When some field is required to be filled. Do not translate :attribute!
                        Example: Password is required, User Name is required, etc.`,
        defaultMessage: ':attribute field is required'
    },
    min: {
        id: 'app.validator.min',
        description: `When a field has less than minimum accepted number of characters.
                      Do not translate :attribute or :min!`,
        defaultMessage: ':attribute should be at least :min characters long.'
    },
    max: {
        id: 'app.validator.max',
        description: `When a field has more that maximum accepted number of characters.
                        Do not translate :attribute or :max!`,
        defaultMessage: ':attribute should not have more than :max characters.'
    },
    passwordNotMatching: {
        id: 'app.validator.passwordNotMatching',
        description: 'When the password field is different than this one.',
        defaultMessage: 'Oups! Password verification is different than first one!'
    },
    usernameExists: {
        id: 'app.validator.usernameExists',
        description: 'When the username chosen already registered',
        defaultMessage: 'Username already registered!'
    }
});
export { validationMessages };
