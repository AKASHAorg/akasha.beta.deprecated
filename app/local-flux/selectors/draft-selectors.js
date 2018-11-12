// @flow

/*::
    type DraftByIdProps = {
        draftId: string
    }

    type SelectionStateProps = {
        draftId: string,
        ethAddress: string
    }
 */

export const selectDraftById = (state/*: Object */, props/*: DraftByIdProps */) => state.draftState.getIn(['drafts', props.draftId]);
export const selectDrafts = (state/*: Object */) => state.draftState.get('drafts');

export const selectDraftsList = (state/*: Object */) => state.draftState.get('draftList');
export const selectDraftsCount = (state/*: Object */) => state.draftState.get('draftsCount');
export const selectDraftsFetched = (state/*: Object */) => state.draftState.get('draftsFetched');
export const selectDraftsSelection = (state/*: Object */) => state.draftState.get('selection');
export const selectFetchingDrafts = (state/*: Object */) => state.draftState.get('fetchingDrafts');
export const selectDraftsResolvingEntries = (state/*: Object */) => state.draftState.get('resolvingEntries');
export const selectDraftIterator = (state/*: Object */) => state.draftState.get('iterator');

export const getDraftsLastBlock = (state/*: Object */) => selectDrafts(state).get('lastBlock');

export const selectDraftsLastIndex = (state/*: Object */) => selectDrafts(state).get('lastIndex');

export const selectDraftsTotalLoaded = (state/*: Object */) => selectDrafts(state).get('totalLoaded');

export const getDraftsMoreEntries = (state/*: Object */) => selectDraftsIterator(state).get('moreEntries')

export const selectSelectionState = (state/*: Object */, props/*: SelectionStateProps */) =>
    state.draftState.getIn(['selection', props.draftId, props.ethAddress]);
