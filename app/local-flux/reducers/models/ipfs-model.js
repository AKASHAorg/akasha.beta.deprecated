import { IpfsRecord } from '../records';

class IpfsModel extends IpfsRecord {
    static computeStatus (newStatus) {
        if (newStatus.started || newStatus.spawned) {
            newStatus.downloading = null;
        }
        return newStatus;
    }
}

export default IpfsModel;
