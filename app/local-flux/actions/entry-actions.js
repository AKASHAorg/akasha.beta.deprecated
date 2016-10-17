import throttle from 'lodash.throttle';
import debug from 'debug';
import { EntryService, ProfileService } from '../services';
import { entryActionCreators } from './action-creators';

const dbg = debug('App:EntryActions');

let entryActions = null;

class EntryActions {
    constructor (dispatch) {
        if (!entryActions) {
            entryActions = this;
        }
        this.dispatch = dispatch;
        this.entryService = new EntryService();
        this.profileService = new ProfileService();
        this.throttledUpdateDraft = throttle(this._throttleUpdateDraft, 2000, {
            trailing: true,
            leading: true
        });
        return entryActions;
    }
    getEntriesCount = () =>
        this.entryService.getResourceCount('entries').then((result) => {
            dbg('dispatching', 'GET_ENTRIES_COUNT_SUCCESS', result);
            return this.dispatch(entryActionCreators.getEntriesCountSuccess(result));
        }).catch(reason => this.dispatch(entryActionCreators.getEntriesCountError(reason)));

    getTags = (startingIndex = 0) => {
        this.dispatch(entryActionCreators.getTags());
        return this.entryService.getTags(startingIndex).then((result) => {
            dbg('dispatching', 'GET_TAGS_SUCCESS', result);
            return this.dispatch(entryActionCreators.getTagsSuccess(result));
        }).catch(reason => this.dispatch(entryActionCreators.getTagsError(reason)));
    };

    checkTagExistence = (tag) => {
        this.dispatch(entryActionCreators.checkTagExistence());
        return this.entryService.checkTagExistence(tag).then((result) => {
            dbg('dispatching', 'CHECK_TAG_EXISTENCE_SUCCESS', result);
            return this.dispatch(entryActionCreators.checkTagExistenceSuccess(result));
        }).catch(reason => this.dispatch(entryActionCreators.checkTagExistenceError(reason)));
    };

    createTag = (tag) => {
        this.dispatch(entryActionCreators.createTag());
        return this.entryService.createTag(tag).then((result) => {
            dbg('dispatching', 'CREATE_TAG_SUCCESS', result);
            return this.dispatch(entryActionCreators.createTagSuccess(result.tag));
        }).catch(reason => this.dispatch(entryActionCreators.createTagError(reason)));
    };

    requestAuthentication = () => {

    };
    getSortedEntries = ({ sortBy }) => {
        this.entryService.getSortedEntries({ sortBy }).then((result) => {
            dbg(result, 'result for sortBy', sortBy);
            return this.dispatch(entryActionCreators.getSortedEntries(result));
        });
    };
    createSavedEntry = (userName, entry) => {
        this.entryService.createSavedEntry(userName, entry).then(savedEntry =>
            this.dispatch(entryActionCreators.createSavedEntrySuccess(savedEntry))
        ).catch(reason => this.dispatch(entryActionCreators.createSavedEntryError(reason)));
    };
    getSavedEntries = userName =>
        this.entryService.getSavedEntries(userName).then((entries) => {
            dbg('getSavedEntries', entries);
            return this.dispatch(entryActionCreators.getSavedEntriesSuccess(entries));
        }).catch(reason => this.dispatch(entryActionCreators.getSavedEntriesError(reason))
        );

    getEntriesForTag = ({ tagName }) => {
        this.entryService.getEntriesForTag({ tagName });
    };
    castUpvote = (entryAddress, voteWeight) => {
        this.entryService.castUpvote(entryAddress, voteWeight).then((result) => {
            if (result.error) {
                return this.dispatch(entryActionCreators.castUpvoteError(result.error));
            }
            return this.dispatch(entryActionCreators.castUpvoteSuccess(result.data));
        });
    };
    castDownvote = (entryAddress, voteWeight) => {};
}
export { EntryActions };
