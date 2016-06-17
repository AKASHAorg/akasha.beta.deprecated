import React from 'react';
import validator from 'react-validation-mixin';
import strategy from 'react-validatorjs-strategy';
import r from 'ramda';

export default function (Component) {
    const validationClass = validator(strategy)(Component);
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
                // server validation here
            });
        }

        render () {
            return (
              <Component
                ref="component"
                errors={this.state.errors}
                validate={this.customValidate}
                isValid={this.isValid}
                getValidationMessages={this.getValidationMessages}
                clearValidations={this.clearValidations}
                handleValidation={this.handleCustomValidation}
                { ...this.props }
              >
                {this.props.children}
              </Component>
            );
        }
    };
}

