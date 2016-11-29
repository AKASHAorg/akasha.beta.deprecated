import r from 'ramda';

// this module provides various data manipulation methods
export const inputFieldMethods = {
    /**
     * Get props for textfields. Auto assign error props and handle textfields` change event.
     * Quick usage:
     * let firstnameProps = getProps (ComponentInstance, {
     *  prop1: true,
     *  prop2: 'someValue',
     *  ...
     * });
     */
    getProps (params) {
        const statePath = params.statePath;
        const parts = statePath.split('.');
        const nameSpace = parts.shift();
        const errorKey = parts[parts.length - 1];
        const props = r.omit(['statePath', 'addValueLink', 'onTextChange', 'onFocus'], params);
        const validationErrors = this.props.getValidationMessages(errorKey);
        const state = this.state;
        let value = state[nameSpace];
        parts.forEach((piece) => {
            value = value[piece];
        });

        const getNewValuePath = (newVal) => {
            const constructedObj = {};
            let internalPtr;
            constructedObj[nameSpace] = r.clone(state[nameSpace]) || {};

            // if the value should be placed right in component's
            // state, then just set the value and return
            if (parts.length === 0) {
                constructedObj[nameSpace] = newVal;
                return constructedObj;
            }

            internalPtr = constructedObj[nameSpace];

            parts.forEach((piece, pieceIndex) => {
                // if it's the last piece
                if (pieceIndex === parts.length - 1) {
                    internalPtr[piece] = newVal;
                    return;
                }

                // mutate the constructedObj via
                // internalPtr object
                internalPtr[piece] = internalPtr[piece] || {};
                internalPtr = internalPtr[piece];
            });

            return constructedObj;
        };

        if (statePath && params.addValueLink) {
            props.onChange = (ev) => {
                this.setState(getNewValuePath(ev.target.value));
                if (params.onTextChange) {
                    params.onTextChange(ev);
                }
            };
        }
        if (props.onFocus) {
            props.onFocus();
        }
        if (validationErrors.length > 0) {
            props.errorText = validationErrors.reduce((prev, current) => `${prev}, ${current}`);
        }
        return props;
    }
};

export const calculateReadingTime = (wordCount, options = {}) => {
    let minutes;
    let hours = null; // hopefully not the case :)
    options.wordsPerMinute = options.wordsPerMinute || 185;

    const time = wordCount / options.wordsPerMinute;
    minutes = Math.floor(time);
    if (minutes > 60) {
        hours = Math.floor(minutes / 60);
        minutes %= 60;
    }

    return {
        hours,
        minutes
    };
};

export const getWordCount = (content) => {
    const plainText = content.getPlainText('');
    const matchWords = plainText.match(/[^~`!¡@#$%^&*()_\-+={}\[\]|\\:;"'<,>.?¿\/\s]+/g);
    return matchWords ? matchWords.length : 0;
};
