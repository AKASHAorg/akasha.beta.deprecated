// @flow
import { createSelector } from 'reselect';
/*::
    type HighlightByIdProps = {
        highlightId: string
    }
 */
export const selectHighlights = (state/*: Object */) => state.highlightState.get('byId');
export const selectHighlightById = (state/*: Object */, props/*: HighlightByIdProps */) =>
    state.highlightState.getIn(['byId', props.highlightId]);
export const selectHighlightsSearchResults = (state/*: Object */) => state.highlightState.get('searchResults');
export const selectHighlightsSearchTerm = (state/*: Object */) => state.highlightState.get('search');
export const selectHighlightsCount = (state/*: Object */) => selectHighlights(state).size;


export const getHighlights = createSelector(
    [selectHighlightsSearchResults,
    selectHighlightsSearchTerm,
    selectHighlights,
    state => state,
    ], (searchRes, searchTerm, highlights, state) => {
        if(searchTerm) {
            return searchRes.map((highlightId/*: string */) =>
                selectHighlightById(state, { highlightId }));
        }
        return highlights.toList();
    }
);
