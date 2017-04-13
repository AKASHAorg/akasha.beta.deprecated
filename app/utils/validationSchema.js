import Joi from 'joi';
import XRegExp from 'xregexp';
import { formMessages, validationMessages } from '../locale-data/messages';

const nameRegExp = XRegExp('^(?:[\\pL]+(?:[\\pL\\p{Common}])*?)+$');
/**
 * get new profile form schema
 * a valid username should:
 *  - max: 32
 *  - min: 2
 *  - lowercase only
 *  - dots and underscores allowed
 *  - cannot start with dot or underline
 *  - cannot end with dot or underline
 *  - numbers allowed
 *  - trimmed
 * @param {Object} intl
 */
export const getProfileSchema = intl =>
    Joi.object().keys({
        firstName: Joi
           .string()
           .required()
           .min(2)
           .max(32)
           .regex(nameRegExp)
           .label(intl.formatMessage(formMessages.firstName))
           .options({
               language: {
                   any: {
                       required: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                       empty: `{{key}} ${intl.formatMessage(validationMessages.required)}`
                   },
                   string: {
                       min: `{{key}} ${intl.formatMessage(validationMessages.min, { min: 2 })}`,
                       max: `{{key}} ${intl.formatMessage(validationMessages.max, { max: 32 })}`,
                       regex: {
                           base: `{{key}} ${intl.formatMessage(validationMessages.invalidCharacters)}`,
                       }
                   }
               }
           }),
        lastName: Joi
           .string()
           .max(32)
           .regex(nameRegExp)
           .allow('')
           .label(intl.formatMessage(formMessages.lastName))
           .options({
               language: {
                   string: {
                       max: `{{key}} ${intl.formatMessage(validationMessages.max, { max: 32 })}`,
                       regex: {
                           base: `{{key}} ${intl.formatMessage(validationMessages.invalidCharacters)}`,
                       }
                   }
               }
           }),
        akashaId: Joi
           .string()
           .trim()
           .required()
           .lowercase()
           .min(4)
           .max(32)
           .label(intl.formatMessage(formMessages.akashaId))
           .options({
               language: {
                   any: {
                       required: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                       empty: `{{key}} ${intl.formatMessage(validationMessages.required)}`
                   },
                   string: {
                       required: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                       min: `{{key}} ${intl.formatMessage(validationMessages.min, { min: 2 })}`,
                       max: `{{key}} ${intl.formatMessage(validationMessages.max, { max: 32 })}`,
                       lowercase: `{{key}} ${intl.formatMessage(validationMessages.lowercase)}`,
                       regex: {
                           base: `{{key}} ${intl.formatMessage(validationMessages.invalidCharacters)}`,
                       }
                   }
               }
           }),
        password: Joi
           .string()
           .required()
           .min(8)
           .label(intl.formatMessage(formMessages.passphrase))
           .options({
               language: {
                   any: {
                       required: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                   },
                   string: {
                       min: `{{key}} ${intl.formatMessage(validationMessages.min, { min: 2 })}`,
                   }
               }
           }),
        password2: Joi
           .string()
           .required()
           .valid(Joi.ref('password'))
           .label(intl.formatMessage(formMessages.passphraseVerify))
           .options({
               language: {
                   any: {
                       required: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                       allowOnly: `{{key}} ${intl.formatMessage(validationMessages.passphraseNotMatching)}`
                   }
               }
           }),
        about: Joi
            .string()
            .allow(''),
        links: Joi
            .array()
            .items(
                Joi.object().keys({
                    id: Joi.number(),
                    title: Joi
                        .string()
                        .max(32)
                        .trim()
                        .label('Title')
                        .options({
                            language: {
                                any: {
                                    empty: `{{key}} ${intl.formatMessage(validationMessages.required)}`
                                },
                                string: {
                                    max: `{{key}} ${intl.formatMessage(validationMessages.max, { max: 32 })}`
                                }
                            }
                        }),
                    url: Joi.alternatives().try(
                    Joi
                        .string()
                        .uri()
                        .label('URL')
                        .options({
                            language: {
                                any: {
                                    empty: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                                },
                                string: {
                                    uri: `{{key}} ${intl.formatMessage(validationMessages.validAddress)}`
                                }
                            }
                        }),
                    Joi
                        .string()
                        .email()
                        .label('URL')
                        .options({
                            language: {
                                any: {
                                    empty: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                                },
                                string: {
                                    email: `{{key}} ${intl.formatMessage(validationMessages.validAddress)}`
                                }
                            }
                        })
                    )
                })
            ).label('Link').options({
                language: {
                    array: {
                        includesOne: '{{reason}}'
                    }
                }
            }),
        crypto: Joi
                    .array()
                    .items(
                        Joi
                            .object()
                            .keys({
                                id: Joi.number(),
                                name: Joi
                                    .string()
                                    .label('Name')
                                    .options({
                                        language: {
                                            any: {
                                                empty: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                                            }
                                        }
                                    }),
                                address: Joi
                                    .string()
                                    .label('Address')
                                    .options({
                                        language: {
                                            any: {
                                                empty: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                                            }
                                        }
                                    })
                            })
                    )
                    .options({
                        language: {
                            array: {
                                includesOne: '{{reason}}'
                            }
                        }
                    })
    });

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
