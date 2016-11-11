import strategy from 'react-validatorjs-strategy';
import { formMessages, validationMessages } from 'locale-data/messages';
/* eslint import/no-unresolved: 0 */

class UserValidation {
    constructor (intl) {
        this.intl = intl;
    }

    getSchema () {
        const { formatMessage } = this.intl;

        return strategy.createSchema({
            firstName: 'required|min:3',
            lastName: 'required|min:3',
            /**
             * regex: /^(?:[a-zA-Z0-9]+(?:.(?!$))?)+$/
             *  - allow alphanumeric
             *  - allow dots inside word
             * akashaId matches [ab.c, a.bc, abcd, abcdef...(32 chars)]
             * akashaId do not match [abc, .abc, abc., ..ab, ab.., etc]
             */
            akashaId: ['required', 'min:4', 'max:32', 'regex:/^\\S(?:[a-z0-9]+(?:.(?!$))?)+$/'],

            password: 'required|min:8',
            password2: 'required|same:password'
        }, {
            required: formatMessage(validationMessages.required),
            min: formatMessage(validationMessages.min),
            max: formatMessage(validationMessages.max),
            regex: 'Only lowercase alphanumeric characters and dots allowed',
            'same.password2': formatMessage(validationMessages.passwordNotMatching),
        }, (validator) => {
            validator.setAttributeNames({
                firstName: formatMessage(formMessages.firstName),
                lastName: formatMessage(formMessages.lastName),
                akashaId: formatMessage(formMessages.akashaId),
                password: formatMessage(formMessages.password),
                password2: formatMessage(formMessages.passwordVerify)
            });
        });
    }
}

export { UserValidation };
