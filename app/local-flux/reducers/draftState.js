import { Map } from 'immutable';
import { DraftModel } from './models';
import { createReducer } from './create-reducer';
import * as types from '../constants';

const initialState = new DraftModel();


// const publishDraftHandler = (state, { flags }) => {
//     const publishPendingDrafts = state.getIn(['flags', 'publishPendingDrafts']);
//     if (publishPendingDrafts === undefined) {
//         return state.merge({
//             flags: state.get('flags').set('publishPendingDrafts', new List([flags.publishPending]))
//         });
//     }
//     const index = publishPendingDrafts.findIndex(flag =>
//         flag.draftId === flags.publishPending.draftId);
//     if (index === -1) {
//         return state.merge({
//             flags: state.get('flags').merge({
//                 publishPendingDrafts: state.getIn(['flags', 'publishPendingDrafts'])
//                     .push(flags.publishPending)
//             })
//         });
//     }
//     return state.merge({
//         flags: state.get('flags').mergeIn(['publishPendingDrafts', index], flags.publishPending)
//     });
// };
const draftState = createReducer(initialState, {
    [types.DRAFT_CREATE_SUCCESS]: (state, { data }) =>
        state.merge({
            drafts: state.get('drafts').set(data.id, DraftModel.createDraft(data)),
            selection: state.get('selection').setIn([data.id, data.akashaId], new Map({
                selectionState: data.selectionState
            }))
        }),

    [types.DRAFT_UPDATE_SUCCESS]: (state, { data }) =>
        state.merge({
            drafts: state.get('drafts').mergeIn([data.draft.id], {
                saved: false,
                ...data.draft
            }),
            selection: state.get('selection').setIn(
                [data.draft.id, data.draft.akashaId],
                data.selectionState
            ),
        }),

    [types.DRAFTS_GET_SUCCESS]: (state, { data }) =>
        state.set('drafts', data.drafts),

    [types.DRAFT_SAVE]: (state, { data }) =>
        state.updateIn(['drafts', `${data.id}`], draft =>
            draft.merge({
                saved: false,
                saving: true,
            })),

    [types.DRAFT_SAVE_SUCCESS]: (state, { data }) =>
        state.updateIn(['drafts', `${data.id}`], draft =>
            draft.merge({
                saved: true,
                saving: false,
                updated_at: data.updated_at
            })),

    [types.DRAFT_AUTOSAVE]: (state, { data }) =>
        state.updateIn(['drafts', data.id], draft =>
            draft.merge({
                saved: false,
                saving: true
            })),

    [types.DRAFT_AUTOSAVE_SUCCESS]: (state, { data }) =>
        state.updateIn(['drafts', data.id], draft =>
            draft.merge({
                saved: true,
                saving: false,
                updated_at: data.updated_at
            })),

    [types.DRAFT_GET_BY_ID_SUCCESS]: (state, { data }) =>
        state.setIn(['drafts', data.draft.id], data.draft),

    [types.DRAFTS_GET_COUNT_SUCCESS]: (state, { data }) =>
        state.set('draftsCount', data.count),
        // [types.DRAFT_SAVE]: (state, { flags }) =>
    //     state.merge({
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [types.DRAFT_CREATE_SUCCESS]: (state, { draft, flags }) => {
    //     const drft = createDraftRecord(draft);
    //     return state.merge({
    //         drafts: state.get('drafts').push(drft),
    //         draftsCount: state.get('draftsCount') + 1,
    //         flags: state.get('flags').merge(flags)
    //     });
    // },

    // [types.DRAFTS_GET]: (state, { flags }) =>
    //     state.merge({
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [types.DRAFTS_GET_SUCCESS]: (state, { drafts, flags }) => {
    //     const drfts = new List(drafts.map(draft => createDraftRecord(draft)));
    //     return state.merge({
    //         drafts: drfts,
    //         flags: state.get('flags').merge(flags)
    //     });
    // },

    // [types.DRAFTS_GET_ERROR]: (state, { error, flags }) =>
    //     state.merge({
    //         errors: state.get('errors').push(new ErrorRecord(error)),
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [types.DRAFT_PUBLISH]: publishDraftHandler,
    // [types.DRAFT_PUBLISH_SUCCESS]: publishDraftHandler,

    // [types.DRAFT_PUBLISH_ERROR]: (state, { error }) =>
    //     state.merge({
    //         errors: state.get('errors').push(new ErrorRecord(error))
    //     }),

    // [types.DRAFT_GET_BY_ID_SUCCESS]: (state, { draft }) => {
    //     if (!draft) return state;
    //     const draftIndex = state.get('drafts').findIndex(drft => drft.id === draft.id);
    //     if (draftIndex > -1) {
    //         return state.mergeIn(['drafts', draftIndex], createDraftRecord(draft));
    //     }
    //     return state.merge({
    //         drafts: state.get('drafts').push(createDraftRecord(draft))
    //     });
    // },

    // [types.UPDATE_DRAFT_SUCCESS]: (state, { draft, flags }) => {
    //     const draftIndex = state.get('drafts').findIndex(drft =>
    //         drft.id === draft.id
    //     );
    //     let updatedDraft = state.getIn(['drafts', draftIndex]).mergeDeep(draft);
    //     if (draft.tags) {
    //         updatedDraft = updatedDraft.set('tags', draft.tags);
    //     }
    //     return state.merge({
    //         drafts: state.get('drafts').setIn([draftIndex], createDraftRecord(updatedDraft.toJS())),
    //         flags: state.get('flags').merge(flags)
    //     });
    // },

    // [types.UPDATE_DRAFT_ERROR]: (state, { error, flags }) =>
    //     state.merge({
    //         errors: state.get('errors').push(new ErrorRecord(error)),
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [types.DELETE_DRAFT_SUCCESS]: (state, { draftId }) => {
    //     const draftIndex = state.get('drafts').findIndex(drft => drft.id === draftId);
    //     return state.merge({
    //         drafts: state.get('drafts').delete(draftIndex)
    //     });
    // },

    // [types.GET_DRAFTS_COUNT]: (state, { flags }) =>
    //     state.merge({
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [types.GET_DRAFTS_COUNT_SUCCESS]: (state, { count, flags }) =>
    //     state.merge({
    //         draftsCount: count,
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [types.GET_PUBLISHING_DRAFTS]: (state, { flags }) =>
    //     state.merge({
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [types.GET_PUBLISHING_DRAFTS_SUCCESS]: (state, { drafts, flags }) =>
    //     state.merge({
    //         drafts: state.get('drafts').toSet().union(new Set(drafts.map(drft =>
    //             createDraftRecord(drft)))).toList(),
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [types.GET_PUBLISHING_DRAFTS_ERROR]: (state, { error, flags }) =>
    //     state.merge({
    //         errors: state.get('errors').push(new ErrorRecord(error)),
    //         flags: state.get('flags').merge(flags)
    //     }),

    // [appTypes.CLEAN_STORE]: () => initialState,
});

export default draftState;
