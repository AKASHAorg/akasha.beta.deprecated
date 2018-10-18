
export const selectDraftById = (state, draftId) => state.draftState.getIn(['drafts', draftId]);

export const selectDrafts = state => state.draftState.get('drafts');

export const selectDraftsLastBlock = state => state.draftState.getIn(['iterator', 'lastBlock']);

export const selectDraftsLastIndex = state => state.draftState.getIn(['iterator', 'lastIndex']);

export const selectDraftsTotalLoaded = state => state.draftState.getIn(['iterator', 'totalLoaded']);

export const selectSelectionState = (state, draftId, ethAddress) =>
    state.draftState.getIn(['selection', draftId, ethAddress]);