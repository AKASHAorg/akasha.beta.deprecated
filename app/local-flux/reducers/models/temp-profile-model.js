import { Record } from 'immutable';
import { TempProfileRecord, TempProfileStatus } from '../records';

const TempProfileModelRecord = Record({
    tempProfile: new TempProfileRecord(),
    status: new TempProfileStatus()
});

export default class TempProfileModel extends TempProfileModelRecord {
    static createTempProfile (profileData) {
        return new TempProfileRecord(profileData);
    }
    static createStatus (status) {
        return new TempProfileStatus(status);
    }
}
