import { GethRecord } from '../records';

export default class GethModel extends GethRecord {
    calculateStatus (newStatus) {
        if (newStatus.api) {
            newStatus.upgrading = null;
            newStatus.message = null;
        }
        if (newStatus.starting || newStatus.spawned || newStatus.api) {
            newStatus.downloading = null;
        }
        if (newStatus.started || newStatus.spawned) {
            newStatus.starting = null;
            newStatus.stopped = null;
        }
        return newStatus;
    }
    getSyncActionId (api) {
        const syncActionId = this.getIn(['flags', 'syncActionId']);
        switch (syncActionId) {
            case (3 && api):
                return 1;
            case 2:
                return syncActionId;
            default:
                return 3;
        }
    }

}
