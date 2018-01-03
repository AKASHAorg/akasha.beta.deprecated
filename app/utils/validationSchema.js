import * as Joi from 'joi-browser';
import XRegExp from 'xregexp';
import { formMessages, validationMessages } from '../locale-data/messages';
import { aboutMeMaxChars } from '../constants/iterator-limits';

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
            // .label(intl.formatMessage(formMessages.firstName))
            .options({
                language: {
                    string: {
                        min: `!!${intl.formatMessage(formMessages.firstName)} ${intl.formatMessage(validationMessages.min, { min: 2 })}`,
                        max: `!!${intl.formatMessage(formMessages.firstName)} ${intl.formatMessage(validationMessages.max, { max: 32 })}`,
                        regex: {
                            base: `!!${intl.formatMessage(formMessages.firstName)} ${intl.formatMessage(validationMessages.invalidCharacters)}`,
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
                        max: `!!${intl.formatMessage(formMessages.lastName)} ${intl.formatMessage(validationMessages.max, { max: 32 })}`,
                        regex: {
                            base: `!!${intl.formatMessage(formMessages.lastName)} ${intl.formatMessage(validationMessages.invalidCharacters)}`,
                        }
                    }
                }
            }),
        about: Joi
            .string()
            .max(aboutMeMaxChars)
            .allow('')
            .options({
                language: {
                    string: {
                        max: `!!${intl.formatMessage(formMessages.about)} ${intl.formatMessage(validationMessages.max, { max: 195 })}`,
                        regex: {
                            base: `!!${intl.formatMessage(formMessages.about)} ${intl.formatMessage(validationMessages.invalidCharacters)}`,
                        }
                    }
                }
            }),
        links: Joi
            .array()
            .items(
                Joi.object({}).keys({
                    id: Joi.number(),
                    url: Joi
                        .string()
                        .label('URL')
                        .uri()
                        .options({
                            language: {
                                any: {
                                    empty: `!!URL ${intl.formatMessage(validationMessages.required)}`,
                                },
                                string: {
                                    uri: `!!URL ${intl.formatMessage(validationMessages.validAddress)}`
                                }
                            }
                        })
                })
            )
            .label('Link').options({
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
                // .label(intl.formatMessage(formMessages.akashaId))
                .options({
                    language: {
                        any: {
                            required: `!!${intl.formatMessage(formMessages.akashaId)} ${intl.formatMessage(validationMessages.required)}`,
                            empty: `!!${intl.formatMessage(formMessages.akashaId)} ${intl.formatMessage(validationMessages.required)}`
                        },
                        string: {
                            required: `!!${intl.formatMessage(formMessages.akashaId)} ${intl.formatMessage(validationMessages.required)}`,
                            min: `!!${intl.formatMessage(formMessages.akashaId)} ${intl.formatMessage(validationMessages.min, { min: 2 })}`,
                            max: `!!${intl.formatMessage(formMessages.akashaId)} ${intl.formatMessage(validationMessages.max, { max: 32 })}`,
                            lowercase: `!!${intl.formatMessage(formMessages.akashaId)} ${intl.formatMessage(validationMessages.lowercase)}`,
                            regex: {
                                base: `!!${intl.formatMessage(formMessages.akashaId)} ${intl.formatMessage(validationMessages.invalidCharacters)}`,
                            }
                        }
                    }
                })
        });
    }
    return baseSchema;
};
