const addRequestToState = (state) => {
    console.log(state, 'the state');
}
export function createReducer (initialState, handlers) {
    return function createdReducer (state = initialState, action) {
        if(!action.type) {
            console.error('An action of type ', action.type, 'was dispatched.');
            console.error('Action payload:', action);
        }
        
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        } else if (
            action.type.endWith('_REQUEST') &&
            handlers.hasOwnProperty('GENERIC_REQUEST_SUCCESS')
        ) {
            /**
             * Handle requests by adding them to state
             * If the handler exists in reducer, call that handler
             */
            return handlers['GENERIC_REQUEST_SUCCESS'](state, action);
        } else if (
            action.type.endWith('_REQUEST_ERROR') &&
            handlers.hasOwnProperty('GENERIC_REQUEST_ERROR')
        ) {
            /**
             * Handle errored requests
             * If the handler exists in reducer, call that handler
             */
            return handlers['GENERIC_REQUEST_ERROR'](state, action);
        } else if(
            action.type.endWith('_REQUEST_END') &&
            handlers.hasOwnProperty('GENERIC_REQUEST_END_SUCCESS')
        ) {
            /**
             * Handle done requests by removing them from state
             * If the handler exists in reducer, call that handler
             */
            return handlers['GENERIC_REQUEST_END_SUCCESS'](state, action);
        }
        return state;
    };
}
