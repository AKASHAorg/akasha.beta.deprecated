export function createReducer (initialState, handlers) {
    return function createdReducer (state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        }
        return state;
    };
}
