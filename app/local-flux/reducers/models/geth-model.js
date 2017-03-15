import { GethRecord } from '../records';

class GethModel extends GethRecord {
    static computeStatus (status) {
        const newStatus = Object.assign({}, status);
        if (newStatus.spawned || newStatus.started) {
            newStatus.message = null;
            newStatus.starting = null;
        }
        if (newStatus.starting || newStatus.spawned || newStatus.api) {
            newStatus.downloading = null;
            newStatus.upgrading = null;
        }
        if (newStatus.stopped) {
            newStatus.starting = false;
            newStatus.started = false;
        }
        return newStatus;
    }
}

export default GethModel;
