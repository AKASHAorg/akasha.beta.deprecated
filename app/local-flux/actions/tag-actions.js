import { tagActionCreators } from './action-creators';
import { TagService } from '../services';

let tagActions = null;

class TagActions {
    constructor (dispatch) {
        if (!tagActions) {
            tagActions = this;
        }
        this.dispatch = dispatch;
        this.tagService = new TagService(dispatch);
        return tagActions;
    }
    getTags = () => {
        this.dispatch(tagActionCreators.getTags());
        this.tagService.getTags().then(data => {
            if (!data) {
                const error = new Error(data.error);
                this.dispatch(tagActionCreators.getTagsError(error));
            }
            this.dispatch(tagActionCreators.getTagsSuccess(data.tags));
        });
    };
    createTag = (tag) => {
        this.dispatch(tagActionCreators.createTag(tag));
        // asuming that all checks already done?
        this.tagService.createTag(tag).then(data => {
            if (!data) {
                const error = new Error(data.error);
                this.dispatch(tagActionCreators.createTagError(error));
            }
            this.dispatch(tagActionCreators.createTagSuccess(data.tag));
        });
    }
}
export { TagActions };
