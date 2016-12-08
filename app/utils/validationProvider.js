import React from 'react';
import validator from 'react-validation-mixin';
import Validatr from 'validatorjs';
import strategy from 'react-validatorjs-strategy';
import { validationMessages } from 'locale-data/messages';
import r from 'ramda';

export default function (Component) {
    const validationClass = validator(strategy)(Component);
    // Validatr.register('akashaIdRule', (value, requirement, attribute) => {
    //     console.log(value, value.match(/[a-z0-9.]/g));
    //     return value.match(/[a-z0-9.]/g);
    // }, 'The :attribute field must be lowercase, alphanumeric with dots only.');
    return class ValidationProvider extends validationClass {
        constructor (props) {
            super(props);
        }
        handleCustomValidation = (key, cb) =>
            function _validateEventHandler (event) {
                event.preventDefault();
                this.customValidate(key, cb);
            }.bind(this);

        customValidate = (key, cb) => {
            if (typeof key === 'function') {
                cb = key;
                key = undefined;
            }
            const validationKey = key.indexOf('.') !== -1 ? key.split('.')[1] : key;
            this.validate(validationKey, (err) => {
                if (err) return;
                // server validation starts here
                const serverValidationRules = this.refs.component.serverValidatedFields;
                if (validationKey.indexOf(serverValidationRules) !== -1) {
                    const validationActionName = `validate${
                        validationKey[0].toUpperCase()
                    }${
                        validationKey.slice(1).toLowerCase()
                    }`;
                    const { validationActions } = this.props;
                    if (!validationActions[validationActionName]) {
                        console.warn(`${validationActionName}() not found in ValidationActions`);
                        return;
                    }
                    const state = this.refs.component.state;
                    const statePathLens = r.lensPath(key.split('.'));
                    const value = r.view(statePathLens, state);
                    const { intl } = this.props;
                    validationActions[validationActionName](value, (error, data) => {
                        if (error) {
                            this.state.errors[validationKey][0] = error.message;
                            return;
                        }
                        if (data.exists) {
                            this.state.errors[validationKey][0] =
                                intl.formatMessage(validationMessages.akashaIdExists);
                            return;
                        }
                        console.log('no errors!', cb);
                        if (typeof cb === 'function') {
                            cb();
                        }
                    });
                }
            });
        }
        render () {
            return (
              <Component
                ref="component"
                errors={this.state.errors}
                isValid={this.isValid}
                getValidationMessages={this.getValidationMessages}
                clearValidations={this.clearValidations}
                handleValidation={this.handleCustomValidation}
                validate={super.validate}
                customValidate={this.customValidate}
                {...this.props}
              >
                {this.props.children}
              </Component>
            );
        }
    };
}

