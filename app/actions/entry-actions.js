import * as types from '../constants/EntryConstants';

class EntryActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
    }
    saveDraft = (draft) => {
        console.log(draft);
    }
}

export { EntryActions };
