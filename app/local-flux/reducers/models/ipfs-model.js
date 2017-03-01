import { IpfsRecord } from '../records';

export default class IpfsModel extends IpfsRecord {
    computeStatus = (newStatus) => {
        if (newStatus.started || newStatus.spawned) {
            newStatus.downloading = null;
        }
        return newStatus;
    }
}
