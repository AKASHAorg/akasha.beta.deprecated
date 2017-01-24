import strategy from 'react-validatorjs-strategy';
import XRegExp from 'xregexp';
import { formMessages, validationMessages } from 'locale-data/messages';

/* eslint import/no-unresolved: 0 */

class UserValidation {
    constructor (intl) {
        this.intl = intl;
    }

    getSchema () {
        const { formatMessage } = this.intl;
        const regExp = XRegExp('^(?:[\\pL]+(?:[\\pL\\p{Common}])*?)+$');
        return strategy.createSchema({
            firstName: ['required', 'min:3', 'max:32', `regex:${regExp}`],
            lastName: ['max:32', `regex:${regExp}`],
            /**
             * regex: /^(?:[a-zA-Z0-9]+(?:.(?!$))?)+$/
             *  - allow alphanumeric
             *  - allow dots inside word
             * akashaId matches [ab.c, a.bc, abcd, abcdef...(32 chars)]
             * akashaId do not match [abc, .abc, abc., ..ab, ab.., etc]
             */
            akashaId: ['required', 'min:4', 'max:32'],
            password: 'required|min:8',
            password2: 'required|same:password'
        }, {
            required: formatMessage(validationMessages.required),
            min: formatMessage(validationMessages.min),
            max: formatMessage(validationMessages.max),
            regex: formatMessage(validationMessages.invalidCharacters),
            'same.password2': formatMessage(validationMessages.passphraseNotMatching),
        }, (validator) => {
            validator.setAttributeNames({
                firstName: formatMessage(formMessages.firstName),
                lastName: formatMessage(formMessages.lastName),
                akashaId: formatMessage(formMessages.akashaId),
                password: formatMessage(formMessages.passphrase),
                password2: formatMessage(formMessages.passphraseVerify)
            });
        });
    }
}

export { UserValidation };
