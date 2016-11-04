import { tagActionCreators } from './action-creators';
import { TagService } from '../services';

let tagActions = null;

class TagActions {
    constructor (dispatch) {
        if (!tagActions) {
            tagActions = this;
        }
        this.dispatch = dispatch;
        this.tagService = new TagService();
        return tagActions;
    }
    // get all pending tags
    getPendingTags = () =>
        this.dispatch((dispatch, getState) => {
            const flags = getState().tagState.get('flags');
            if (!flags.get('fetchingPendingTags')) {
                dispatch(tagActionCreators.getPendingTags({
                    fetchingPendingTags: true
                }));
                this.tagService.getPendingTags({
                    onSuccess: data => dispatch(tagActionCreators.getPendingTagsSuccess(data, {
                        fetchingPendingTags: false
                    })),
                    onError: error => dispatch(tagActionCreators.getPendingTagsError(error, {
                        fetchingPendingTags: false
                    }))
                });
            }
        });

    getTags = (options) => {
        this.dispatch(tagActionCreators.getTags());
        this.tagService.getLocalTagsCount().then((tagsCount) => {
            const startingIndex = (options && options.fetchAll) ? 0 : tagsCount;
            this.tagService.getTags(startingIndex).then((data) => {
                if (!data) {
                    const error = new Error(data.error);
                    this.dispatch(tagActionCreators.getTagsError(error));
                }
                this.dispatch(tagActionCreators.getTagsSuccess(data.tags));
            });
        });
    };
    registerTag = (tagName, token, gas = 2000000) => {
        console.log('registering tag', tagName);
        this.dispatch(tagActionCreators.registerTag(tagName));
        this.tagService.registerTag({
            tagName,
            token,
            gas,
            onSuccess: (data) => {
                this.dispatch(tagActionCreators.registerTagSuccess(data));
                console.log('register tag success', data);
                // save to pending tags
                this.savePendingTag({ tag: tagName, tx: data.tx });
            },
            onError: error => this.dispatch(tagActionCreators.registerTagError(error))
        });
    };
    savePendingTag = tagObj =>
        this.tagService.savePendingTag({
            tagObj,
            onSuccess: data => this.dispatch(tagActionCreators.savePendingTagSuccess(data)),
            onError: error => this.dispatch(tagActionCreators.savePendingTagError(error))
        });

}
export { TagActions };
