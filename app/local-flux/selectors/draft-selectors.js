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

export const selectDraftsLastBlock = (state/*: Object */) => state.draftState.getIn(['iterator', 'lastBlock']);

export const selectDraftsLastIndex = (state/*: Object */) => state.draftState.getIn(['iterator', 'lastIndex']);

export const selectDraftsTotalLoaded = (state/*: Object */) => state.draftState.getIn(['iterator', 'totalLoaded']);

export const selectSelectionState = (state/*: Object */, props/*: SelectionStateProps */) =>
    state.draftState.getIn(['selection', props.draftId, props.ethAddress]);
