import { EntryActions, ProfileActions } from './';
let bootstrapActions = null;

class BootstrapActions {
    constructor (dispatch) {
        if (!bootstrapActions) {
            bootstrapActions = this;
        }
        this.entryActions = new EntryActions(dispatch);
        this.profileActions = new ProfileActions(dispatch);
        this.dispatch = dispatch;
        return bootstrapActions;
    }
    
    initApp = (getState) => {
        // @TODO check the status of external services (including geth network)
        // @TODO check for logged profile
        // @TODO check for application updates
        // @TODO check for newer entries
        const promises = [];
        promises.push(this.entryActions.getEntriesCount());
        promises.push(this.entryActions.getDraftsCount());
        return Promise.all(promises);
    };
    
    initStreamPage = () => {};
}

export { BootstrapActions };
