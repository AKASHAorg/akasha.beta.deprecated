import { GethRecord } from '../records';

class GethModel extends GethRecord {
    calculateStatus (newStatus) {
        if (newStatus.api) {
            newStatus.upgrading = null;
            newStatus.message = null;
            newStatus.starting = null;
            newStatus.stopped = null;
        }
        if (newStatus.starting || newStatus.spawned || newStatus.api) {
            newStatus.downloading = null;
        }

        return newStatus;
    }
}

export default GethModel;
