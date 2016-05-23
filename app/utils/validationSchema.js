import strategy from 'react-validatorjs-strategy';
import { defineMessages } from 'react-intl';
import { formMessages } from '../locale-data/messages';

class UserValidation {
    constructor (intl) {
        this.messages = defineMessages({
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
            }
        });
        this.intl = intl;
    }
    getSchema () {
        const { formatMessage } = this.intl;
        return strategy.createSchema({
            firstName: 'required|min:3',
            lastName: 'required|min:3',
            userName: 'required|min:4',
            password: 'required|min:8',
            password2: 'required|same:password'
        }, {
            required: formatMessage(this.messages.required),
            min: formatMessage(this.messages.min),
            max: formatMessage(this.messages.max),
            'same.password2': formatMessage(this.messages.passwordNotMatching),
        }, (validator) => {
            validator.setAttributeNames({
                firstName: this.intl.formatMessage(formMessages.firstName),
                lastName: this.intl.formatMessage(formMessages.lastName),
                userName: this.intl.formatMessage(formMessages.userName),
                password: this.intl.formatMessage(formMessages.password),
                password2: this.intl.formatMessage(formMessages.passwordVerify)
            });
        });
    }
}

export { UserValidation };
