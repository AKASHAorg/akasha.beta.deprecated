import { GethRecord } from '../records';

class GethModel extends GethRecord {
    static computeStatus (newStatus) {
        if (newStatus.spawned || newStatus.started) {
            newStatus.upgrading = null;
            newStatus.message = null;
            newStatus.starting = null;
        }
        if (newStatus.starting || newStatus.spawned || newStatus.api) {
            newStatus.downloading = null;
        }

        return newStatus;
    }
}

export default GethModel;
