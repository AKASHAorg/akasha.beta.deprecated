export function createReducer (initialState, handlers) {
    /* eslint-disable complexity */
    return function createdReducer (state = initialState, action) {
        if (!action.type) {
            console.error('An action of type ', action.type, 'was dispatched.');
            console.error('Action payload:', action);
        }

        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else if (
            action.type.endsWith('_REQUEST') &&
            handlers.hasOwnProperty('GENERIC_REQUEST_START')
        ) {
            /**
             * Handle requests by adding them to state
             * If the handler exists in reducer, call that handler
             */
            return handlers['GENERIC_REQUEST_START'](state, action);
        } else if (
            action.type.endsWith('_REQUEST_START_ERROR') &&
            handlers.hasOwnProperty('GENERIC_REQUEST_START_ERROR')
        ) {
            /**
             * Handle errored requests
             * If the handler exists in reducer, call that handler
             */
            return handlers['GENERIC_REQUEST_START_ERROR'](state, action);
        } else if (
            action.type.endsWith('_REQUEST_END_SUCCESS') &&
            handlers.hasOwnProperty('GENERIC_REQUEST_END_SUCCESS')
        ) {
            /**
             * Handle done requests by removing them from state
             * If the handler exists in reducer, call that handler
             */
            return handlers['GENERIC_REQUEST_END_SUCCESS'](state, action);
        } else if (
            action.type.endsWith('_REQUEST_END_ERROR') &&
            handlers.hasOwnProperty('GENERIC_REQUEST_END_ERROR')
        ) {
            /**
             * Handle done requests by removing them from state
             * If the handler exists in reducer, call that handler
             */
            return handlers['GENERIC_REQUEST_END_ERROR'](state, action);
        }
        return state;
    };
}
