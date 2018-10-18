export const selectHighlight = (state, id) => state.highlightState.getIn(['byId', id]);

export const selectHighlights = (state) => {
    const searchResults = state.highlightState.get('searchResults');
    if (state.highlightState.get('search')) {
        return searchResults.map(id => state.highlightState.getIn(['byId', id]));
    }
    return state.highlightState.get('byId').toList();
};

export const selectHighlightsCount = state => state.highlightState.get('byId').size;

export const selectHighlightSearch = state => state.highlightState.get('search');
