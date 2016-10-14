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
    registerTags = (tags) => {
        this.dispatch(tagActionCreators.registerTags(tags));
        // asuming that all checks already done?
        return this.tagService.registerTags(tags).then((data) => {
            if (!data) {
                const error = new Error(data.error);
                this.dispatch(tagActionCreators.registerTagsError(error));
            }
            this.dispatch(tagActionCreators.registerTagsSuccess(data.tags));
        });
    }
}
export { TagActions };
