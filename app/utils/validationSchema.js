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
            firstName: 'required|min:3|max:32',
            lastName: 'max:32',
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
