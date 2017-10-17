import * as Joi from 'joi-browser';
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
export const getProfileSchema = (intl, options) => {
    const baseSchema = Joi.object().keys({
        firstName: Joi
            .string()
            .allow('')
            .min(2)
            .max(32)
            .regex(nameRegExp)
            .label(intl.formatMessage(formMessages.firstName))
            .options({
                language: {
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
                    url: Joi
                        .string()
                        .label('URL')
                        .uri()
                        .options({
                            language: {
                                any: {
                                    empty: `{{key}} ${intl.formatMessage(validationMessages.required)}`,
                                },
                                string: {
                                    uri: `{{key}} ${intl.formatMessage(validationMessages.validAddress)}`
                                }
                            }
                        })
                })
            ).label('Link').options({
                language: {
                    array: {
                        includesOne: '{{reason}}'
                    }
                }
            })
    });
    if (options && !options.isUpdate) {
        return baseSchema.keys({
            akashaId: Joi
                .string()
                .trim()
                .required()
                .lowercase()
                .min(2)
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
                })
        });
    }
    return baseSchema;
};
