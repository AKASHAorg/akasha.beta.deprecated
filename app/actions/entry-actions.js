import * as types from '../constants/EntryConstants';
import { EntryService } from '../services';

class EntryActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.entryService = new EntryService();
    }
    saveDraft = (draft) => {
        this.dispatch({ type: types.SAVE_DRAFT, draft });
        this.entryService.saveDraft(draft).then((result) => {
            console.log(result);
        });
    }
}

export { EntryActions };
