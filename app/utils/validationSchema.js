import Joi from 'joi';
import XRegExp from 'xregexp';
import { formMessages, validationMessages } from '../locale-data/messages';

const nameRegExp = XRegExp('^(?:[\\pL]+(?:[\\pL\\p{Common}])*?)+$');

/**
 * get new profile form schema
 * a valid username should:
 *  - contain only lowercase alphanumeric characters
 *  - should not start or end with dot or underscore
 *  - should not contain multiple dots or underscores one after another
 * @param {Object} intl
 */

export const profileSchema = Joi.object().keys({
    firstName: Joi
    .string()
    .required()
    .min(2)
    .max(32)
    .regex(nameRegExp)
    .label('First Name'),
    lastName: Joi
        .string()
        .max(32)
        .regex(nameRegExp)
        .label('Last Name'),
    akashaId: Joi
        .string()
        .required()
        .lowercase()
        .trim()
        .min(4)
        .max(32)
        .label('Username'),
    password: Joi
        .string()
        .required()
        .min(8)
        .label('Password'),
    password2: Joi
        .string()
        .required()
        .valid(Joi.ref('password'))
        .label('Password Confirmation')
});


export const getErrorMessages = (intl) => {
    const { formatMessage } = intl;
    console.log(intl, 'the intl');
    return {
        language: {
            any: {
                required: `{{key}} ${formatMessage(validationMessages.required)}`,
                min: `{{key}} ${formatMessage(validationMessages.min)}`,
                max: `{{key}} ${formatMessage(validationMessages.max)}`,
                allowOnly: `{{key}} ${formatMessage(validationMessages.passphraseNotMatching)}`
            },
            // allowOnly: {
            //     password2: `{{key}} ${formatMessage(validationMessages.passphraseNotMatching)}`
            // },
            // regex: {
            //     firstName: `{{key}} ${formatMessage(validationMessages.invalidCharacters)}`,
            //     lastName: `{{key}} ${formatMessage(validationMessages.invalidCharacters)}`,
            // },
        }
    };
};


// class UserValidation {
//     constructor (intl) {
//         this.intl = intl;
//     }

//     getSchema () {
//         const { formatMessage } = this.intl;
//         const regExp = XRegExp('^(?:[\\pL]+(?:[\\pL\\p{Common}])*?)+$');
//         return strategy.createSchema({
//             firstName: ['required', 'min:3', 'max:32', `regex:${regExp}`],
//             lastName: ['max:32', `regex:${regExp}`],
//             /**
//              * regex: /^(?:[a-zA-Z0-9]+(?:.(?!$))?)+$/
//              *  - allow alphanumeric
//              *  - allow dots inside word
//              * akashaId matches [ab.c, a.bc, abcd, abcdef...(32 chars)]
//              * akashaId do not match [abc, .abc, abc., ..ab, ab.., etc]
//              */
//             akashaId: ['required', 'min:4', 'max:32'],
//             password: 'required|min:8',
//             password2: 'required|same:password'
//         }, {
//             required: formatMessage(validationMessages.required),
//             min: formatMessage(validationMessages.min),
//             max: formatMessage(validationMessages.max),
//             regex: formatMessage(validationMessages.invalidCharacters),
//             'same.password2': formatMessage(validationMessages.passphraseNotMatching),
//         }, (validator) => {
//             validator.setAttributeNames({
//                 firstName: formatMessage(formMessages.firstName),
//                 lastName: formatMessage(formMessages.lastName),
//                 akashaId: formatMessage(formMessages.akashaId),
//                 password: formatMessage(formMessages.passphrase),
//                 password2: formatMessage(formMessages.passphraseVerify)
//             });
//         });
//     }
// }

// export { UserValidation };
