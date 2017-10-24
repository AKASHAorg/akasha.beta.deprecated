import { defineMessages } from 'react-intl';

const validationMessages = defineMessages({
    required: {
        id: 'app.validator.required',
        description: 'When some field is required to be filled.',
        defaultMessage: 'field is required'
    },
    min: {
        id: 'app.validator.min',
        description: `When a field has less than minimum accepted number of characters.
                      Do not translate {min} !`,
        defaultMessage: 'must be at least {min} characters long.'
    },
    max: {
        id: 'app.validator.max',
        description: `When a field has more that maximum accepted number of characters.
                        Do not translate {max}!`,
        defaultMessage: 'must not have more than {max} characters.'
    },
    invalidCharacters: {
        id: 'app.validator.invalidCharacters',
        description: 'When a field does not start with a letter or contains invalid characters',
        defaultMessage: 'must start with a letter and only contain valid characters'
    },
    passphraseNotMatching: {
        id: 'app.validator.passphraseNotMatching',
        description: 'When the passphrase field is different than this one.',
        defaultMessage: 'Oups! Passphrase verification is different than first one!'
    },
    lowercase: {
        id: 'app.validator.lowercase',
        description: 'only lowercase letters',
        defaultMessage: 'should contain only lowercase letters'
    },
    akashaIdExists: {
        id: 'app.validator.akashaIdExists',
        description: 'When the akashaId chosen already registered',
        defaultMessage: 'akashaId already registered!'
    },
    akashaIdNotValid: {
        id: 'app.validator.akashaIdNotValid',
        description: 'When the akashaId is not valid',
        defaultMessage: 'Only lowercase alphanumeric characters allowed'
    },
    validAddress: {
        id: 'app.validator.validAddress',
        description: 'A valid address (URL) is required',
        defaultMessage: 'must be a valid address'
    },
    maxExcerptLength: {
        id: 'app.validator.maxExcerptLength',
        description: 'Info message about max length of an excerpt',
        defaultMessage: 'The excerpts can have max. 120 characters'
    },
});
export { validationMessages };
