import { AbstractEmitter } from './AbstractEmitter';
declare abstract class IpfsEmitter extends AbstractEmitter {
    attachEmitters(): void;
    private _download();
    private _started();
    private _stopped();
    private _catchCorrupted();
    private _catchFailed();
    private _catchError();
}
export default IpfsEmitter;
